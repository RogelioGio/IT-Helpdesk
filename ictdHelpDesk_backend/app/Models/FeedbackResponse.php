<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedbackResponse extends Model
{
    protected $table = 'feedbackresponses';

    protected $fillable = [
        'feedback_id',
        'dimension_id',
        'dimension_value',
    ];

    public function feedback(){
        return $this->belongsTo(Feedback::class, 'feedback_id', 'id');
    }

    public function dimension(){
        return $this->belongsTo(FeedbackDimension::class, 'dimension_id', 'id');
    }
}
