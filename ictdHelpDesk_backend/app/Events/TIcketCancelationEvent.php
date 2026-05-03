<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class TicketCancelationEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public $ticket,
        public User $actor
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
            new PrivateChannel('realtime-channel-' . str_replace(' ', '', $this->actor->account_role->name) . '-' . $this->actor->id),
        ];
    }
    public function broadcastAs(): string
    {
        return 'ticket.cancelled';
    }
    public function broadcastWith(): array
    {
        Log::info('Broadcasting ticket cancellation event in the channel realtime-channel-' . str_replace(' ', '', $this->actor->account_role->name) . '-' . $this->actor->id, [
            'ticket_id' => $this->ticket->id,
            'actor_id' => $this->actor->id,
        ]);

        return [
            'ticket' => $this->ticket->resolve(),
            'actor' => $this->actor->only(['id', 'name']),
        ];
    }
}
