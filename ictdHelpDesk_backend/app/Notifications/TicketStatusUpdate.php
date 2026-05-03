<?php

namespace App\Notifications;

use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

class TicketStatusUpdate extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Ticket $ticket
    )
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $status = strtolower($this->ticket->status->name);

        return [
            "model" => "Ticket",
            "action" => strtolower($this->ticket->status->name),
            "title" => "Ticket #{$this->ticket->ticketId} has been {$status}",
            "description" => "The status of ticket #{$this->ticket->ticketId} has been updated to {$this->ticket->status->name}",
            "navigation_id" => $this->ticket->ticketId,
        ];
    }
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        $status = strtolower($this->ticket->status->name);
        return new BroadcastMessage([
            "model" => "Ticket",
            "action" => strtolower($this->ticket->status->name),
            "toastHeader" => "Ticket has been {$status}",
            "toastDescription" => "#{$this->ticket->ticketId} has been updated to {$this->ticket->status->name}",
            "context" => new TicketResource($this->ticket)
        ]);
    }
}
