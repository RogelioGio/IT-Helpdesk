<?php

namespace App\Events;

use App\Models\Ticket;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TicketStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $ticket;

    public function __construct(Ticket $ticket)
    {
        // Load relationships so the frontend has the status name (Open, Closed, etc.)
        $this->ticket = $ticket->load(['status', 'priority', 'requester']);
    }

    public function broadcastOn(): array
    {
        // Using a public channel 'tickets' for easy testing. 
        // You can switch to PrivateChannel('tickets.' . $this->ticket->id) later.
        return [
            new Channel('tickets'),
        ];
    }

    public function broadcastAs(): string
    {
        // This is the exact string React's .listen() looks for
        return 'TicketStatusUpdated';
    }
}