<?php

namespace App\Events;

use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class TicketCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $ticketsCount;
    public $todayTicketsCount;
    public $yesterdayTicketsCount;
    public $ticketGrowthPercentage;

    /**
     * Create a new event instance.
     */
    public function __construct()
    {
        $this->ticketsCount =Ticket::count();
        // Use fixed strings to avoid any Carbon object shifting during the query
        $today = now()->toDateString();
        $yesterday = now()->subDay()->toDateString();

        $stats = Ticket::query()
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->whereDate('created_at', '>=', $yesterday)
            ->groupBy('date')
            ->pluck('count', 'date');

        $this->todayTicketsCount = (int) $stats->get($today, 0);
        $this->yesterdayTicketsCount = (int) $stats->get($yesterday, 0);

        // This WILL show in storage/logs/laravel.log IF the event runs
        if ($this->yesterdayTicketsCount > 0) {
            $this->ticketGrowthPercentage = round((($this->todayTicketsCount - $this->yesterdayTicketsCount) / $this->yesterdayTicketsCount) * 100, 2);
        } else {
            $this->ticketGrowthPercentage = $this->todayTicketsCount > 0 ? 100 : 0;
        }
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('dashboard-manager-realtime'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'ticket.created';
    }

    public function broadcastWith(): array
    {
        return [
            'total_ticket' => $this->ticketsCount,
            'ticket_volume_growth' => $this->ticketGrowthPercentage,
        ];


    }
}
