<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecentTickets extends Model
{
    // 1. Fillable allows us to save data into these columns
  protected $fillable = ['user_id', 'ticket_id', 'updated_at'];
    /**
     * Relationship: This connects the "Recent" record to the actual Ticket.
     */
    public function ticket(): BelongsTo
    {
        // We tell Laravel to look in the 'ticket' table (your singular name)
        return $this->belongsTo(Ticket::class, 'ticket_id');
    }
}