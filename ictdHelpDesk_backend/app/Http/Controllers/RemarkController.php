<?php

namespace App\Http\Controllers;

use App\Events\RemarkDeleted;
use App\Events\RemarkUpdated;
use App\Http\Resources\RemarksResource;
use App\Http\Resources\TicketResource;
use App\Models\Remark;
use App\Models\Ticket;
use App\Models\User;
use App\Notifications\RemarkNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;

class RemarkController extends Controller
{
    public function store(Request $request) {
        $user = Auth::user();
        $request->validate([
            'body' => 'required|string',
            'remarkable_id' => 'required|integer',
            'remarkable_type' => 'required|string',
        ]);

        $modelMap = [
            'ticket' => Ticket::class,
        ];

        $modelClass = $modelMap[strtolower($request->remarkable_type)] ?? null;
        $model = $modelClass ? $modelClass::find($request->remarkable_id) : null;

        $remark = $model->remarks()->create([
            'body' => $request->body,
            'user_id' => $user->id,
        ]);
        $recipients = [];

        $instance = "";
        $context = null;
        if($model instanceof Ticket) {
            $managersAndAdmin = User::whereHas('account_role', function($query) {
                $query->whereIn('name', ['System Admin', 'Administrator', 'Manager']);
            })->get();

            $recipients = $managersAndAdmin->concat([$model->requester])
            ->concat($model->responder)
            ->filter()
            ->unique('id')
            ->reject(function($actor) use ($user) {
                return $actor->id === $user->id;
            });
            $instance = "Ticket";
            $context = new TicketResource($model);


            Notification::send($recipients, new RemarkNotification($remark, $instance, $model , $context));
        }

        return new RemarksResource($remark->load('user'));
    }
    public function index(Request $request) {
        $request->validate([
            'remarkable_id' => 'required|integer',
            'remarkable_type' => 'required|string',
        ]);

        $modelMap = [
            'ticket' => Ticket::class,
        ];

        $modelClass = $modelMap[strtolower($request->remarkable_type)] ?? null;
        $model = $modelClass ? $modelClass::find($request->remarkable_id) : null;

        if (!$model) {
            return response()->json(['message' => 'Model not found'], 404);
        }

        return RemarksResource::collection($model->remarks()->with('user')->get());
    }
    public function update(Request $request, $id) {
        $request->validate([
            'body' => 'required|string',
        ]);

        $remark = Remark::find($id);
        $ticket = $remark->remarkable()->first();

        if (!$remark) {
            return response()->json(['message' => 'Remark not found'], 404);
        }

        // Optional: Check if the authenticated user owns the remark
        if ($remark->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $remark->update([
            'body' => $request->body,
        ]);

        broadcast(new RemarkUpdated(new RemarksResource($remark->load('user')), $ticket->id))->toOthers();

        return new RemarksResource($remark->load('user'));
    }

    public function destroy($id)
    {
        $remark = Remark::find($id);

        $ticketId = $remark->remarkable_id;
        $remarkId = $remark->id;

        $ticket = $remark->remarkable()->first();

        $recipients = User::whereHas('account_role', function($query) {
            $query->whereIn('name', ['System Admin', 'Administrator', 'Manager']);
        })->get()
        ->concat([$ticket->requester])
        ->concat($ticket->responder)
        ->flatten()
        ->filter()
        ->unique('id')
        ->reject(fn($u) => $u->id === Auth::id());

        if (!$remark) {
            return response()->json(['message' => 'Remark not found'], 404);
        }

        // Authorization: Only the owner or an admin should delete
        if ($remark->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $remark->delete(); // This triggers the Soft Delete

        broadcast(new RemarkDeleted(new RemarksResource($remark->load('user')), $ticketId))->toOthers();

        return response()->json(['message' => 'Remark deleted successfully']);
    }
}
