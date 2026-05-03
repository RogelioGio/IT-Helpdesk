<?php

namespace App\Http\Controllers;

use App\Events\ticketCancelationEvent;
use App\Events\TicketCancelationEvent as EventsTicketCancelationEvent;
use App\Events\TicketClosed;
use App\Events\TIcketResolved;
use App\Events\TicketResponded;
use App\Models\Ticket;
use Broadcast;
use Illuminate\Http\Request;
use App\Http\Requests\AddTicketRequest;
use App\Http\Resources\TicketResource;
use App\Models\Activity;
use App\Models\ActivitySpecifications;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\UpdateTicketRequest;
use App\Events\TicketStatusUpdated;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\RecentTickets;
use App\Models\Cancellation;
use App\Notifications\TicketAssigned;
use App\Notifications\TicketAssignmentUpdate;
use App\Notifications\TicketCancellation;
use App\Notifications\TicketStatusUpdate;
use App\Notifications\TicketUnassigned;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class TicketController extends Controller
{
public function index(Request $request)
{
    $perPage = $request->query('per_page', 10);

    $tickets = Ticket::search($request->query('search', ''))
    ->when($request->activity_id && $request->activity_id !== 'all', function($scoutQuery) use ($request) {
        $scoutQuery->where('activity_id', $request->activity_id);})
    ->when($request->activitySpecification_id && $request->activitySpecification_id !== 'all', function($scoutQuery) use ($request) {
        $scoutQuery->where('activitySpecification_id', $request->activitySpecification_id);})
    ->when($request->priority_id && $request->priority_id !== 'all', function($scoutQuery) use ($request) {
        $scoutQuery->where('priority_id', $request->priority_id);})
    ->when($request->status_id && $request->status_id !== 'all', function($scoutQuery) use ($request) {
        $scoutQuery->where('status_id', $request->status_id);})
    ->orderBy('created_at', 'desc')
    ->paginate($perPage);

    $total = (int) collect($tickets->total())->first();
    $lastPage = (int) collect($tickets->lastPage())->first();
    $currentPage = (int) collect($tickets->currentPage())->first();

    return TicketResource::collection($tickets)->additional([
        'success' => true,
        'message' => 'Tickets retrieved successfully.',
        'meta' => [
            'total' => $total,
            'last_page' => $lastPage,
            'current_page' => $currentPage,
            'per_page' => (int) $tickets->perPage(),
        ]
    ]);
}


public function recordRecentView($ticketId)
{
    $user = Auth::user(); // Get the full user object to check roles

    // 1. Check if user is logged in
    if ($user) {

        // --- ROLE CHECK FOR TESTING ---
        // If you only want Officers to have a "Recently Viewed" list:
        // if ($user->role !== 'officer') { return; }
        // ------------------------------

        // updateOrCreate checks if this user already viewed THIS ticket.
        RecentTickets::updateOrCreate(
            ['user_id' => $user->id, 'ticket_id' => $ticketId],
            ['updated_at' => now()]
        );

        // 2. Get all recent views for this user, newest first
        $allRecent = RecentTickets::where('user_id', $user->id)
            ->orderBy('updated_at', 'desc')
            ->get();

        // 3. If there are more than 5, delete the older ones
        if ($allRecent->count() > 5) {
            $idsToDelete = $allRecent->slice(5)->pluck('id');
            RecentTickets::whereIn('id', $idsToDelete)->delete();
        }
    }
}

public function getRecentTickets()
{
    $user = Auth::user();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User not authenticated.'
        ], 401);
    }

    $recentTickets = RecentTickets::where('user_id', $user->id)
        ->with('ticket') // Eager load the related ticket
        ->orderBy('updated_at', 'desc')
        ->get()
        ->pluck('ticket') // Extract the ticket from each recent view
        ->filter() // Remove any nulls (in case a ticket was deleted)
        ->values(); // Reindex the collection

    return TicketResource::collection($recentTickets)->additional([
        'success' => true,
        'message' => 'Recent tickets retrieved successfully.',
        'ticket' => $recentTickets->count() . ' results found.'
    ]);
}



//     public function recentCreated()
// {
//     $user = Auth::user();
//     if (!$user) {
//         return redirect()->route('login');
//     }
//     $recentTickets = Ticket::where('requester_id', $user->id)
//         ->latest()
//         ->limit(5)
//         ->get();
//     return view('dashboard', compact('recentTickets'));
// }

public function store(AddTicketRequest $request)
    {
        $data = $request->validated();
        $user = User::find($data['requester_id']);
        // $user = Auth::user();

        $activityCode = Activity::find($data['activity_id'])->activityCode;
        $activitySpecificationCode = ActivitySpecifications::find($data['activitySpecification_id'])->activitySpecificationCode;
        $officeDepartmentDivisionCode = $user->office_department_division->officeCode;
        $employeeId = $user->employeeID;
        $date= now()->format('Ymd');
        $uid = Str::upper(Str::random(4));

        $ticketId = $activityCode . '-' . $activitySpecificationCode . '-' . $officeDepartmentDivisionCode . '-' . $employeeId . '-' . $date . '-' . $uid;

        $ticket = Ticket::create(array_merge($data, ['ticketId' => $ticketId]));


        $ticket->timeline()->attach($ticket->status_id, [
        'user_id' => Auth::id(),
    ]);
            return (new TicketResource($ticket))
                ->additional(['message' => 'Ticket created successfully.'])
                ->response()
                ->setStatusCode(201);
        }

    /**
     * Display the specified resource.
     */
    public function show($ticket)
    {
        // Include trashed parents so historical tickets don't crash
        $selectedTicket = Ticket::with([
            'activity' => fn($q) => $q->withTrashed(),
            'activitySpecification' => fn($q) => $q->withTrashed(),
            'status', 'priority', 'requester', 'responder', 'feedback', 'timeline', 'remarks.user', 'cancellation'
        ])->where('ticketId', $ticket)->first();

        $this->recordRecentView($selectedTicket->id);

        return new TicketResource($selectedTicket);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTicketRequest $request, Ticket $ticket)
    {
        // 1. Get only the data that passed validation (including 'description')
        $data = $request->validated();

        // 2. Perform the update.

        $ticket->update($data);
        broadcast(new TicketStatusUpdated($ticket->load(['activity', 'status', 'requester'])));

        return (new TicketResource($ticket->load(['activity', 'status', 'requester'])))
            ->additional(['message' => 'Ticket updated successfully.']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        // Moves the ticket to archive (sets deleted_at)
        $ticket->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ticket moved to archive.'
        ]);
    }


    public function patchTicketCriticalLevel(Ticket $ticket, Request $request)
    {
        if (!$ticket) {
            return response()->json([
                'message' => 'Ticket not found.'
            ], 404);
        }

        $ticket->priority_id = $request->priority_id;
        $ticket->save();

        return response()->json([
            'message' => 'Priority level updated successfully.',
            'data' => $ticket
        ], 200);

    }

    public function patchTicketAssignment(Ticket $ticket, Request $request)
    {
        $request->validate([
        'assigned_to' => 'required|array',
        'assigned_to.*' => 'exists:users,id'
        ]);
        if (!$ticket) {
            return response()->json([
                'message' => 'Ticket not found.'
            ], 404);
        }

        $currentResponderIds = $ticket->responder()->pluck('id')->toArray();

        $changes = $ticket->responder()->sync($request->assigned_to);

        $hasChanges = !empty($changes['attached']) || !empty($changes['detached']) || !empty($changes['updated']);

        $stillAssignedIds = array_intersect($currentResponderIds, $request->assigned_to);

        if($ticket->status_id === 1 && !empty($request->assigned_to)) {
            $ticket->status_id = 2;
            $ticket->save();

            $ticket->timeline()->attach($ticket->status_id, [
                'user_id' => Auth::id(),
            ]);

            $newUsers = User::whereIn('id', $changes['attached'])->get();
            $stakeholders = collect([$ticket->requester_id])
                ->concat(User::whereHas('account_role', function($query) {
                    $query->whereIn('name', ['System Admin', 'Administrator', 'Manager']);
                })->pluck('id'))
                ->unique()
                ->reject(fn($id) => $id === Auth::id())
                ->values();

            if ($stakeholders->isNotEmpty()) {
                $usersToNotify = User::whereIn('id', $stakeholders)->get();
                Notification::send($usersToNotify, new TicketStatusUpdate($ticket));
            }
            if ($newUsers->isNotEmpty()) {
                Notification::send($newUsers, new TicketAssigned($ticket));
            }
        } else {

            if (!empty($changes['detached'])) {
                $removedUsers = User::whereIn('id', $changes['detached'])->get();
                Notification::send($removedUsers, new TicketUnassigned($ticket));
            }
            if (!empty($changes['attached'])) {
                $newUsers = User::whereIn('id', $changes['attached'])->get();
                Notification::send($newUsers, new TicketAssigned($ticket));
            }

            Log::info('Still assigned IDs: ' . implode(', ', $stillAssignedIds));
            $stakeholders = collect([$ticket->requester_id])
                ->concat(User::whereHas('account_role', function($query) {
                    $query->whereIn('name', ['System Admin', 'Administrator', 'Manager']);
                })->pluck('id'))
                ->concat($stillAssignedIds)
                ->unique()
                ->reject(fn($id) => $id === Auth::id())
                ->values();

            if ($stakeholders->isNotEmpty()) {
                $usersToNotify = User::whereIn('id', $stakeholders)->get();
                Notification::send($usersToNotify, new TicketAssignmentUpdate($ticket));
            }
        }

        if (!$hasChanges) {
            return response()->json([
                'ticket' => new TicketResource($ticket),
                'message' => 'No changes in assignment. The ticket is already assigned to the specified users.',
            ], 200);
        }

        return response()->json([
            'hasChanges' => $hasChanges,
        ], 200);


    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:ticket,id'
        ]);

        Ticket::whereIn('id', $request->ids)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tickets deleted successfully.',
            'total' => count($request->ids),

        ]);

    }

    public function bulkRestore(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:ticket,id'
        ]);

        $ticketsToRestore = Ticket::withTrashed()->whereIn('id', $request->ids);

        $count = $ticketsToRestore->count();

        if ($count === 0) {
            return response()->json([
                'success' => false,
                'message' => 'No archived tickets found for the provided IDs.'
            ], 404);
        }

        $ticketsToRestore->restore();

        return response()->json([
            'success' => true,
            'message' => 'Tickets restored successfully.',
            'total' => $count
        ]);


    }

public function patchTicketResponded(Ticket $ticket, Request $request)
{
    $user = Auth::user();
    $ticket->status_id = 3;
    $ticket->save();

    $responder = $ticket->responder()->pluck('id')->toArray();

    $ticket->timeline()->attach(
        $ticket->status_id, [
        'user_id' => Auth::id(),
    ]);

    $recipients = collect([$ticket->requester_id])
        ->concat($responder)
        ->concat(User::whereHas('account_role', function($query) {
            $query->whereIn('name', ['System Admin', 'Administrator', 'Manager']);
        })->pluck('id'))
        ->unique()->reject(fn($id) => $id === Auth::id())
        ->values();
    if ($recipients->isNotEmpty()) {
        if($user->account_role->name === "User") {
            broadcast(new TicketResponded(new TicketResource($ticket), $user));
        }

        $usersToNotify = User::whereIn('id', $recipients)->get();
        Notification::send($usersToNotify, new TicketStatusUpdate($ticket));
    }

    return response()->json([
        'message' => 'Ticket response updated successfully.',

        'data' => new TicketResource($ticket->load('status'))
    ], 200);
}

    public function patchTicketResolved(Ticket $ticket, Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'findings' => 'required|string',
            'resolution' => 'nullable|string',
        ]);

        if (!$ticket) {
            return response()->json([
                'message' => 'Ticket not found.'
            ], 404);
        } else if ($ticket->status_id !== 3) {
            return response()->json([
                'message' => 'Only tickets with status "Responded" can be marked as resolved.'
            ], 400);
        }

        $ticket->findings = $request->findings;
        $ticket->resolution = $request->resolution;


        $ticket->status_id = 4; // Resolved
        $ticket->save();


        $responder = $ticket->responder()->pluck('id')->toArray();

        $ticket->timeline()->attach($ticket->status_id, [
            'user_id' => Auth::id(),
        ]);

        $recipients = collect([$ticket->requester_id])
            ->concat($responder)
            ->concat(User::whereHas('account_role', function($query) {
                $query->whereIn('name', ['System Admin', 'Administrator', 'Manager']);
            })->pluck('id'))
            ->unique()->reject(fn($id) => $id === Auth::id())
            ->values();

        if ($recipients->isNotEmpty()) {
            if($user->account_role->name === "Officer") {
                broadcast(new TIcketResolved(new TicketResource($ticket), $user));
            }

            $usersToNotify = User::whereIn('id', $recipients)->get();
            Notification::send($usersToNotify, new TicketStatusUpdate($ticket));
        }





        return response()->json([
            'message' => 'Ticket response updated successfully.',
            'data' => new TicketResource($ticket->load('status'))
        ], 200);
    }

  public function closeTicket(Ticket $ticket, Request $request)
{
    // $request->validate([
    //     'resolution' => 'required|string',
    // ]);

    // $ticket->resolution = $request->resolution;

    $user = Auth::user();
    $ticket->status_id = 5; // Closed
    $ticket->dateClosed = now();
    $ticket->save();

    $ticket->timeline()->attach($ticket->status_id, [
        'user_id' => Auth::id(),
    ]);

    $responder = $ticket->responder()->pluck('id')->toArray();
    $recipients = collect([$ticket->requester_id])
            ->concat($responder)
            ->concat(User::whereHas('account_role', function($query) {
                $query->whereIn('name', ['System Admin', 'Administrator', 'Manager']);
            })->pluck('id'))
            ->unique()->reject(fn($id) => $id === Auth::id())
            ->values();
        if ($recipients->isNotEmpty()) {
            if($user->account_role->name === "User") {
                broadcast(new TicketResponded(new TicketResource($ticket), $user));
            }

            $usersToNotify = User::whereIn('id', $recipients)->get();
            Notification::send($usersToNotify, new TicketStatusUpdate($ticket));

        }



    return response()->json([
        'success' => true,
        'message' => 'Ticket closed successfully.',
        'data' => new TicketResource($ticket->load('status'))
    ], 200);
}

public function cancelTicket(Ticket $ticket, Request $request)
{
    $user = Auth::user();
    if ($ticket->status_id === 6) {
        return response()->json([
            'success' => false,
            'message' => 'This ticket is already cancelled.'
        ], 400);
    }

    $request->validate([
        'cancel_reason_id' => 'required',
        'custom_reason'    => 'required_if:cancel_reason_id,0|nullable|string|max:1000',
    ]);

    $ticket->status_id = 6;
    $ticket->save();

    Cancellation::create([
        'ticket_id'        => $ticket->id,
        'cancelled_by'     => $user->id,
        'cancel_reason_id' => $request->cancel_reason_id === 0 ? null : $request->cancel_reason_id,
        'custom_reason'    => $request->custom_reason,
        'cancelled_at'     => now(),
    ]);

    $ticket->timeline()->attach($ticket->status_id, [
        'user_id' => Auth::id(),
    ]);

    $admins = User::whereHas('account_role', function($query) {
        $query->whereIn('name', ['System Admin', 'Administrator', 'Manager']);
    })->get();

    $responders = collect();
    if($ticket->responder()->exists()){
        $responders = $ticket->responder()->get();
    }

    $recipients = collect([$ticket->requester_id])
        ->concat($responders->pluck('id'))
        ->concat($admins->pluck('id'))
        ->unique()->reject(fn($id) => $id === Auth::id())
        ->values();

    if ($recipients->isNotEmpty()) {
        if ($user->account_role->name === "User" || $user->account_role->name === "Officer") {
            broadcast(new TicketCancelationEvent(new TicketResource($ticket), $user));
        }

        $usersToNotify = User::whereIn('id', $recipients)->get();
        Notification::send($usersToNotify, new TicketCancellation($ticket));
    }


    return (new TicketResource($ticket->load(['status', 'cancellation'])))
        ->additional([
            'success' => true,
            'message' => 'Ticket successfully cancelled by ' . $user->firstName . ' ' . $user->lastName
        ]);
}

public function officerTicket(Request $request) {
    $user = Auth::id();
    $tickets = Ticket::with(['requester', 'responder', 'status', 'priority'])
        ->when($request->status_id === 'active', function($query) use ($user) {
            $query
            ->whereHas('priority')
            ->whereIn('status_id', [1, 2])
            ->where(function ($subQuery) use ($user) {
                $subQuery->whereHas('responder', function ($q) use ($user) {
                            $q->where('user_id', $user);
                    })->orDoesntHave("responder");
                });
        })
        ->when($request->status_id && $request->status_id === 6, function($query) use ($user) {
            $query->whereHas('responder', function ($q) use ($user) {
                $q->where('user_id', $user);
            })
            ->where('status_id', 6);
        })
        ->when($request->status_id && $request->status_id !== "active" && $request->status_id !== 6, function($query) use ($request, $user) {
            $query->where('status_id', $request->status_id)
                  ->whereHas('responder', function ($q) use ($user) {
                        $q->where('user_id', $user);
                });
        })
        ->orderBy('created_at', 'desc')
        ->get();
    return TicketResource::collection($tickets)
        ->additional([
            'success' => true,
            'message' => 'Tickets retrieved successfully.',
            'ticket'  => $tickets->count() . ' results found.'
        ]);
}


public function userTickets(Request $request) {
    $user = Auth::id();
    $tickets = Ticket::with(['requester', 'responder', 'status', 'priority'])
        ->when($request->status_id === 'active', function($query) use ($user) {
            $query->whereIn('status_id', [1, 2]);
        })
        ->when($request->status_id && $request->status_id !== "active", function($query) use ($request) {
            $query->where('status_id', $request->status_id);
        })
        ->where('requester_id', $user)
        ->orderBy('created_at', 'desc')
        ->get();
    return TicketResource::collection($tickets)
        ->additional([
            'success' => true,
            'message' => 'Tickets retrieved successfully.',
            'ticket'  => $tickets->count() . ' results found.'
        ]);


}

}
