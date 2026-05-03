<?php

namespace App\Notifications;

use App\Http\Resources\NotificationResource;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketRelevanceUpdate extends Notification
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
        return [
            "model" => "Ticket",
            "action" => "criticality_" . strtolower($this->ticket->priority->name),
            "title" => "Ticket Criticality Updated - {$this->ticket->priority->name}",
            "message" => "The criticality level of ticket #{$this->ticket->ticketId} has been updated to {$this->ticket->priority->name}",
            "navigation_id" => $this->ticket->ticketId,
        ];
    }
    public function toBroadcast($notifiable): BroadcastMessage
    {
        $isRequester = $this->ticket->requester_id === $notifiable->id;

        return new BroadcastMessage([
            "model" => "Ticket",
            "action" => "criticality_" . strtolower($this->ticket->priority->name),
            "toastHeader" => "Ticket Criticality Updated",
            "toastDescription" => "The criticality level of ticket #{$this->ticket->ticketId} has been updated to {$this->ticket->priority->name}",
            "context" => new TicketResource($this->ticket)
        ]);
    }
}
