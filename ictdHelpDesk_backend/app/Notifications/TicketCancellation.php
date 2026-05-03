<?php

namespace App\Notifications;

use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketCancellation extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Ticket $ticket,
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
        $reasons = $this->ticket->cancelReasons->map(function($reason) {
            $custom = $reason->pivot->custom_reason ? " ({$reason->pivot->custom_reason})" : "";
            return $reason->reason . $custom;
        })->join(', ');

        return [
            "model" => "Ticket",
            "action" => "cancelled",
            "title" => "Ticket Cancelled",
            "description" => "The ticket {$this->ticket->ticketId} has been cancelled with the following reason: {$reasons}",
            "navigation_id" => $this->ticket->ticketId,
        ];
    }

    public function toBroadcast($notifiable): BroadcastMessage {
        $reasons = $this->ticket->cancelReasons->map(function($reason) {
            $custom = $reason->pivot->custom_reason ? " ({$reason->pivot->custom_reason})" : "";
            return $reason->reason . $custom;
        })->join(', ');

        return new BroadcastMessage([
            "model" => "Ticket",
			"action" => "cancelled",
			"toastHeader" => "Ticket Cancelled",
			"toastDescription" => "{$this->ticket->ticketId} has been cancelled",
            "context" => new TicketResource($this->ticket),
            "notification" => [
                "model" => "Ticket",
                "action" => "cancelled",
                "title" => "Ticket Cancelled",
                "description" => "The ticket {$this->ticket->ticketId} has been cancelled with the following reason: {$reasons}",
                "navigation_id" => $this->ticket->ticketId,
            ]
        ]);
    }
}
