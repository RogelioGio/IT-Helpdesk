<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Audit extends Model
{
    protected $guarded = [];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

   
    protected $appends = ['message', 'diff'];

  
     protected $hidden = [
    'password',
    'remember_token',
];
   protected $friendlyNames = [
    'activity_id' => 'Activity',
    'activitySpecification_id' => 'Specification',
    'assetSerialNumber' => 'Asset Serial Number',
    'status_id' => 'Status',
    'requester_id' => 'Requester',
    'description' => 'Description',
];
   

    /**
     * Accessor for the human-readable message.
     */
  public function getMessageAttribute(): string
{
    // Check if the user exists and concatenate the names
    $userName = 'System';
    if ($this->user) {
        $userName = trim($this->user->firstName . ' ' . $this->user->lastName);
    }
    
    $modelName = Str::afterLast($this->auditable_type, '\\');

    return match ($this->event) {
        'created' => "{$userName} created a new {$modelName}.",
        'updated' => "{$userName} updated this {$modelName}.",
        'deleted' => "{$userName} deleted {$modelName} #{$this->auditable_id}.",
        default   => "{$userName} performed a {$this->event} action.",
    };
}

    protected function formatUpdateMessage($userName, $modelName): string
{
    if (empty($this->new_values)) {
        return "{$userName} updated the {$modelName}.";
    }

    $changedFields = [];
    foreach ($this->new_values as $key => $value) {
        $oldValue = $this->old_values[$key] ?? null;
        if ($oldValue != $value) {
            // Use friendly name if available
            $changedFields[] = $this->friendlyNames[$key] ?? str_replace('_', ' ', $key);
        }
    }

    if (empty($changedFields)) {
        return "{$userName} saved the {$modelName} without changes.";
    }

    return "{$userName} updated the " . implode(', ', $changedFields) . " on this {$modelName}.";
}

public function getDiffAttribute(): array
{
    if ($this->event === 'created') return [];
    $diff = [];
    $old = $this->old_values ?? [];
    $new = $this->new_values ?? [];

    foreach ($new as $key => $value) {
        $oldValue = $old[$key] ?? 'None';
        
        // Only record if the value actually changed
        if ($oldValue != $value) {
            $label = $this->friendlyNames[$key] ?? str_replace('_', ' ', $key);
            $diff[] = [
                'field' => $label,
                'from'  => $oldValue,
                'to'    => $value
            ];
        }
    }

    return $diff;
}
    public function user()
    {
        return $this->belongsTo(User::class);
    }

     public function auditable(): MorphTo
    {
        return $this->morphTo();
    }

}

