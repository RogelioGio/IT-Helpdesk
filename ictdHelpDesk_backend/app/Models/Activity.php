<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Laravel\Scout\Searchable;
class Activity extends Model
{
    use SoftDeletes, Searchable;

    protected $touches = ['tickets'];

    protected $table = "activity";

    protected $fillable = [
        'activityCode',
        'name',
        'description',
    ];


    protected static function booted()
    {
        static::deleting(function ($activity) {
            $activity->activitySpecifications()->delete();
        });

        static::restoring(function ($activity) {
            $activity->activitySpecifications()->withTrashed()->restore();
        });
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'activity_id', 'id');
    }

    public function activitySpecifications()
    {

        return $this->hasMany(ActivitySpecifications::class, 'activity_id', 'id')->withTrashed();
    }

    public function audits(): MorphMany
{
    return $this->morphMany(Audit::class, 'auditable');
}
}
