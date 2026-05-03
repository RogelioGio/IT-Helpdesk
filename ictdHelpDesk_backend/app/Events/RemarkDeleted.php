<?php

namespace App\Events;

use App\Models\Remark;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class RemarkDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public $remark,
        public $ticketId,
    )
        {

        }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        Log::info("Broadcasting RemarkDeleted event for ticket ID: " . $this->ticketId);
        return [
            new PrivateChannel('ticket.' . $this->ticketId . '.remarks'),
        ];
    }
    public function broadcastAs(): string
    {
        return 'remark.deleted';
    }
    public function broadcastWith(): array
    {
        Log::info("Broadcasting remark data for deletion: " . $this->remark->id);
        return [
            'remark' => $this->remark->resolve(),
        ];
    }
}
