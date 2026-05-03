<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class UpdateTicketListUser implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public $ticket
    )
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('realtime-channel-User-' . $this->ticket->requester->id),
        ];
    }
    public function broadcastAs(): string
    {
        return 'user.ticket.created';
    }
    public function broadcastWith(): array
    {
        Log::info('Broadcasting UpdateTicketListUser event with ticket data: ' . json_encode($this->ticket));
        return [
            'ticket' => $this->ticket->resolve(),
        ];
    }
}
