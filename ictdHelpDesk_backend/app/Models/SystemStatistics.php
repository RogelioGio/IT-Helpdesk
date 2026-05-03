<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemStatistics extends Model
{
    public $table = 'systemstatistics';

    protected $fillable = [
        'metric_key',
        'value',
        'recorded_at',
    ];
}
