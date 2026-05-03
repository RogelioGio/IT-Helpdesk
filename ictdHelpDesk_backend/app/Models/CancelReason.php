<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CancelReason extends Model
{
    protected $fillable = ['reason', 'description'];

    public function cancellations()
    {
        return $this->hasMany(Cancellation::class, 'cancel_reason_id');
    }

    public function ticket()
    {
        return $this->hasManyThrough(Ticket::class, Cancellation::class, 'cancel_reason_id', 'id', 'id', 'ticket_id');
    }
}
