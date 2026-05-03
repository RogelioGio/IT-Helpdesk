<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $table = 'feedback';

    protected $fillable = [
        'ticket_id',
        'requester_id',
        'suggestion',
        'commendation',
        'complaint',
    ];

    public function ticket(){
        return $this->belongsTo(Ticket::class, 'ticket_id', 'id');
    }

    public function dimensions(){
        return $this->belongsToMany(
            FeedbackDimension::class,
            'feedbackresponses',
            'feedback_id',
            'dimension_id'
        )->withPivot('dimension_value')
        ->withTimestamps();
    }

    public function requester(){
        return $this->belongsTo(User::class, 'requester_id', 'id');
    }

    public function feedbackResponses(){
        return $this->hasMany(FeedbackResponse::class, 'feedback_id', 'id');
    }

}
