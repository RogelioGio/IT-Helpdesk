<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cancellation extends Model
{
    protected $fillable = [
        'ticket_id',
        'cancel_reason_id',
        'custom_reason',
        'cancelled_by',  // Must be here!
        'cancelled_at'   // Must be here!
    ];
public function getDisplayReasonAttribute()
    {
        if ($this->cancel_reason_id) {
            return $this->reason->reason;
        }

        return $this->custom_reason ?? 'No reason provided';
    }
  public function ticket()
{
    return $this->belongsTo(Ticket::class, 'ticket_id');
}

public function reason()
{
    // Links the cancel_reason_id to the cancel_reasons lookup table
    return $this->belongsTo(CancelReason::class, 'cancel_reason_id');
}

public function canceller()
{
    // Links cancelled_by to the Users table
    return $this->belongsTo(User::class, 'cancelled_by');
}
  
    
}