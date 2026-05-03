<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
class TicketStatus extends Model
{
    protected $table = "ticketstatus";

    protected $fillable = [
        'name',
        'description',
    ];
public static function getNameById($id)
{
    // Caches the entire table for 24 hours
    $statuses = Cache::remember('all_ticket_statuses', now()->addDay(), function () {
        return self::all()->pluck('name', 'id');
    });

    return $statuses[$id] ?? null;
}
    // TODO: Add relationships to other models if necessary

    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'status_id');
    }
}
