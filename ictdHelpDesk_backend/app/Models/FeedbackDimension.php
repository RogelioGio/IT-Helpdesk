<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedbackDimension extends Model
{
    protected $table = 'feedbackdimension';

    protected $fillable = [
        'name',
        'description',
    ];

    public function feedbacks(){
        return $this->belongsToMany(
            Feedback::class,
            'feedbackresponses',
            'dimension_id',
            'feedback_id'
        )->withPivot('dimension_value');
    }
}
