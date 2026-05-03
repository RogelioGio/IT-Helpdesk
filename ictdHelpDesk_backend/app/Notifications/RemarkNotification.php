<?php

namespace App\Notifications;

use App\Http\Resources\RemarksResource;
use App\Models\Remark;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

class RemarkNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Remark $remark,
        public string $instance,
        public $model,
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
    //     public function toMail(object $notifiable): MailMessage
    //     {
    //         return (new MailMessage)
    //         ->line('The introduction to the notification.')
    //         ->action('Notification Action', url('/'))
    //         ->line('Thank you for using our application!');
    // }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable): array
    {
        $description = "";
        if($this->instance === "Ticket") {
            $description = "A new remark has been added to the ticket #{$this->model->ticketId} by {$this->remark->user->firstName} {$this->remark->user->lastName}";
        } else {
            $description = "A new remark has been added to the {$this->instance} #{$this->remark->remarkable_id}";
        };

        $navigationId = $this->instance === "Ticket" ? $this->model->ticketId : null;

        return [
            "model" => $this->instance,
            "action" => "remark_added",
            "title" => "New Remark Added",
            "description" => $description,
            "navigation_id" => $navigationId
        ];
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {
        $header = "";
        $description = "";

        if($this->instance === "Ticket") {
            $header = "New Remark Added";
            $description = "A new remark has been added to the ticket #{$this->model->ticketId} ";
        } else {
            $header = "New Remark Added to {$this->instance} #{$this->remark->remarkable_id}";
            $description = "A new remark has been added to the {$this->instance} #{$this->remark->remarkable_id}";
        };

        return new BroadcastMessage([
            "model" => $this->instance,
            "action" => "remark_added",
            "toastHeader" => $header,
            "toastDescription" => $description,
            "context" => new RemarksResource($this->remark->load('user')),
        ]);
    }
}
