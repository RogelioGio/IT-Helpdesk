<?php

namespace App\Notifications;

use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Broadcast;

class AssigmentRequest extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Ticket $ticket,
        public User $requester
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
     * Get the mail representation of the notification.
     */
    // public function toMail(object $notifiable): MailMessage
    // {
    //     return (new MailMessage)
    //         ->line('The introduction to the notification.')
    //         ->action('Notification Action', url('/'))
    //         ->line('Thank you for using our application!');
    // }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            "model" => "Ticket",
            "action" => "assignment_request",
            "title" => "New officer assignment request",
            "description" => "Officer {$this->requester->firstName} {$this->requester->lastName} has requested to be assigned to ticket #{$this->ticket->ticketId}",
            "navigation_id" => $this->ticket->ticketId,
        ];
    }
    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            "model" => "Ticket",
            "action" => "assignment_request",
            "toastHeader" => "New Assignment Request",
            "toastDescription" => "A new officer assignment request has been made for ticket #{$this->ticket->ticketId}",
            "context" => new TicketResource($this->ticket),
        ]);
    }
}
