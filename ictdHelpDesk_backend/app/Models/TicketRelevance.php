<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
class TicketRelevance extends Model
{
    protected $table = "ticketrelevance";

    protected $fillable = [
        'relevanceCode',
        'name',
        'description',
    ];

   public function audits(): MorphMany
    {
        return $this->morphMany(Audit::class, 'auditable');
    }

    public function tickets(){
        return $this->hasMany(Ticket::class, 'priority_id');
    }
}
