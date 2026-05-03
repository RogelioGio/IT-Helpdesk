<?php

namespace App\Http\Controllers;

use App\Events\AssignmentListUpdated;
use App\Http\Resources\AssignmentResource;
use App\Models\Ticket;
use App\Models\RequestAssignment;
use App\Http\Resources\TicketResource;
use App\Models\User;
use App\Notifications\AcceptRequest;
use App\Notifications\AssigmentRequest;
use App\Notifications\RejectRequest;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;

class AssignmentController extends Controller
{
    /**
     * Technician requests a ticket.
     * Logic: Save to 'requestassignment' table.
     */
// public function index(Request $request)
// {
//     $assignments = RequestAssignment::search($request->query('search', ''))
//         ->query(function ($eloquentQuery) use ($request) {

//             // Eager load with "Safety Nets" for deleted records
//             $eloquentQuery->with([
//                 'ticket' => function($q) { $q->withTrashed(); },
//                 'user' => function($q) { $q->withTrashed(); }
//             ]);

//             if ($request->query('status') === 'archived') {
//                 $eloquentQuery->onlyTrashed();
//             } else {
//                 $eloquentQuery->withoutTrashed();
//             }

//             $eloquentQuery->orderBy('created_at', 'desc');
//         })
//         ->get();

//     return AssignmentResource::collection($assignment)->additional([
//         'success' => true,
//     ]);
//}

    public function requestAssignment(Request $request, Ticket $ticket)
    {
        $userId = Auth::id();

        // Only Open tickets (status 1) can be requested
        if ( $ticket->status_id !== 1) {
            return response()->json(['message' => 'Ticket is no longer open.'], 422);
        }

        // Prevent duplicate requests
        $exists = RequestAssignment::where('ticket_id', $ticket->id)
            ->where('user_id', $userId)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'You have already applied.'], 422);
        }

        RequestAssignment::create([
            'ticket_id' => $ticket->id,
            'user_id'   => $userId,
        ]);

        $managerAndAdmins = User::whereHas('account_role', function($query) {
            $query->whereIn('name', ['System Admin', 'Administrator', 'Manager']);
        })->get();

        $recipients = $managerAndAdmins
            ->unique('id')
            ->reject(fn($user) => $user->id === $userId)
            ->values();

        if($recipients->isNotEmpty()) {
            Notification::send($recipients, new AssigmentRequest($ticket, Auth::user()));
        }

        return response()->json(['message' => 'Application submitted successfully.']);
    }


    public function Accept1(Request $request, $id)
    {
        // Manager role check
        if ((int)Auth::user()->account_role_id !== 5) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // 1. Find the application
        $application = RequestAssignment::findOrFail($id);
        $ticket = $application->ticket;

        // 2. Assign to Pivot Table (ticketassignment)
        // syncWithoutDetaching ensures we don't overwrite existing responders if any
        $ticket->responder()->syncWithoutDetaching([$application->user_id]);

        // 3. Update Ticket status and assignementDate
        $ticket->update([
            'status_id'       => 2, // Assigned
            'assignementDate' => now(),
        ]);

        // 4. Force Delete ALL requests for this ticket ID (Cleanup)
        RequestAssignment::where('ticket_id', $ticket->id)->forceDelete();

        return (new TicketResource($ticket->load('responder')))
            ->additional(['message' => 'Technician assigned. Requests purged.']);
    }

    public function accept(RequestAssignment $assignment)
    {
        if ((int)Auth::user()->account_role_id === 5) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $ticket = $assignment->ticket;
        $ticket->responder()->syncWithoutDetaching([$assignment->user_id]);
        if($ticket->status_id === 1) {
            $ticket->update([
                'status_id' => 2,
            ]);
        }

        $ticket->timeline()->attach($ticket->status_id, ['user_id' => Auth::id()]);
        $assignment->forceDelete();

        $requester = $assignment->user_id;
        $recipients = User::where('id', $requester)->get();
        Notification::send($recipients, new AcceptRequest($ticket));

        $managerAndAdmins = User::whereHas('account_role', function($query) {
            $query->whereIn('name', ['System Admin', 'Administrator', 'Manager']);
        })->get();
        $eventReciever = $managerAndAdmins->unique('id')->reject(fn($user) => $user->id === Auth::id())->values();
        $channels = $eventReciever->map(function($user) {
            $roleName = str_replace(' ', '', $user->account_role->name);
            return new PrivateChannel("realtime-channel-{$roleName}-{$user->id}");
        })->toArray();
        if (!empty($channels)) {
            broadcast(new AssignmentListUpdated(new TicketResource($ticket), $channels));
        }

        return (new TicketResource($ticket->load('responder')))
            ->additional(['message' => 'Technician assigned. Requests purged.']);

    }


    /**
     * Manager rejects a specific request.
     */
    public function reject(RequestAssignment $assignment)
    {
        if ((int)Auth::user()->account_role_id === 5) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $assignment->forceDelete();
        $ticket = $assignment->ticket;


        $requester = $assignment->user_id;
        $recipients = User::where('id', $requester)->get();
        Notification::send($recipients, new RejectRequest($ticket));

        $managerAndAdmins = User::whereHas('account_role', function($query) {
            $query->whereIn('name', ['System Admin', 'Administrator', 'Manager']);
        })->get();
        $eventReciever = $managerAndAdmins->unique('id')->values();
        $channels = $eventReciever->map(function($user) {
            $roleName = str_replace(' ', '', $user->account_role->name);
            return new PrivateChannel("realtime-channel-{$roleName}-{$user->id}");
        })->toArray();
        if (!empty($channels)) {
            broadcast(new AssignmentListUpdated(new TicketResource($ticket), $channels));
        }

        return (new TicketResource($ticket->load('responder')))
            ->additional(['message' => 'Request rejected and removed.']);
    }
}
