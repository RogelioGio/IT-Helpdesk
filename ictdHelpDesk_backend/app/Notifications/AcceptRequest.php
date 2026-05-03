<?php

namespace App\Notifications;

use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AcceptRequest extends Notification
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
            "action" => "assignment_request_approved",
            "title" => "Assignment Request Approved",
            "description" => "Your request to be assigned to ticket #{$this->ticket->ticketId} has been approved",
            "navigation_id" => $this->ticket->ticketId
        ];
    }
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            "model" => "Ticket",
            "action" => "assignment_request_approved",
            "toastHeader" => "Request Approved",
            "toastDescription" => "Your request for ticket #{$this->ticket->ticketId} has been approved",
            "context" => new TicketResource($this->ticket),
        ]);
    }
}
