<?php

namespace App\Observers;
use App\Events\UpdateTicketListUser;
use App\Http\Resources\TicketResource;
use App\Models\SystemStatistics;
use App\Models\Ticket;
use App\Models\User;
use App\Notifications\TicketAssigned;
use App\Notifications\TicketCreated;
use App\Notifications\TicketCreatedNotification;
use App\Notifications\TicketRelevanceUpdate;
use App\Notifications\TicketStatusUpdate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;

class TicketObserver
{
    /**
     * Handle the Ticket "created" event.
     */
    public function created(Ticket $ticket): void
    {
        broadcast(new TicketCreated($ticket));

        $today = now()->toDateString();
        SystemStatistics::where('metric_key', 'total_tickets')
            ->where('recorded_at', $today)
            ->increment('value');

        $responders = User::whereHas('account_role', function($query) {
            $query->whereIn('name', ['System Admin', 'Administrator', 'Manager']);
        })->get();

        $requester = $ticket->requester;
        if($requester->account_role->name === "User") {
            broadcast(new UpdateTicketListUser(new TicketResource($ticket)));
        }

        if($responders->isNotEmpty()) {
            Notification::send($responders, new TicketCreated($ticket));
        }


    }

    /**
     * Handle the Ticket "updated" event.
     */
    public function updated(Ticket $ticket): void
    {
        if($ticket->wasChanged('priority_id')) {
            $actor = Auth::id();

            $personsToNotify = collect([$ticket->requester_id]);

            if($ticket->responder()->exists()){
                $responderIds = $ticket->responder->pluck('id');
                $personsToNotify = $personsToNotify->concat($responderIds);
            }

            $adminAndManagers = User::whereHas('account_role', function($query) {
                $query->whereIn('name', ['System Admin', 'Administrator', 'Manager']);
            })->get();
            $personsToNotify = $personsToNotify->concat($adminAndManagers->pluck('id'))->unique();

            $recipients = $personsToNotify
            ->unique()
            ->filter()
            ->reject(fn($id) => $id === $actor)
            ->values();

            if($recipients->isNotEmpty()) {
                $users = User::whereIn('id', $recipients)->get();
                Notification::send($users, new TicketRelevanceUpdate($ticket));
            }

        }
    }

    /**
     * Handle the Ticket "deleted" event.
     */
    public function deleted(Ticket $ticket): void
    {
        //
    }

    /**
     * Handle the Ticket "restored" event.
     */
    public function restored(Ticket $ticket): void
    {
        //
    }

    /**
     * Handle the Ticket "force deleted" event.
     */
    public function forceDeleted(Ticket $ticket): void
    {
        //
    }
}
