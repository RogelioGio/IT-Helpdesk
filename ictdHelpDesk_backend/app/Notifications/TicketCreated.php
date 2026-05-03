<?php

namespace App\Notifications;

use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class TicketCreated extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Ticket $ticket
    )
    {}

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
    public function toArray($notifiable): array
    {

        return [
            "model" => "Ticket",
            "action" => "created",
            "title" => "New Created Ticket",
            "message" => "A new ticket has been created by {$this->ticket->requester->firstName} {$this->ticket->requester->lastName} with an Ticket ID: #{$this->ticket->ticketId}",
            "navigation_id" => $this->ticket->ticketId
        ];
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {

        return new BroadcastMessage([
            "model" => "Ticket",
            "action" => "created",
            "toastHeader" => "New Created Ticket",
            "toastDescription" => "A new support ticket has been created and is awaiting some action",
            "context" => new TicketResource($this->ticket)
        ]);
    }
}
