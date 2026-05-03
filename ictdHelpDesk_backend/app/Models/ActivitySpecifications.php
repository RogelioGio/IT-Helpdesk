<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Laravel\Scout\Searchable;

class ActivitySpecifications extends Model
{
    use SoftDeletes, Searchable;
    protected $table = "activityspecification";

    protected $fillable = [
        'activitySpecificationCode',
        'name',
        'description',
        'activity_id',
    ];

public function toSearchableArray(): array
    {
        return [
            'id'                        => (int) $this->id,
            'activitySpecificationCode' => $this->activitySpecificationCode,
            'name'                      => $this->name,
            'description'               => $this->description,
        ];
    }
    public function activity(){
        return $this->belongsTo(Activity::class, 'activity_id', 'id');
    }

    public function audits(): MorphMany
    {
        return $this->morphMany(Audit::class, 'auditable');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'activitySpecification_id', 'id');
    }

}
