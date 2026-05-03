<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IncidentDensityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'activities' => $this->activities->map(function($activity) {
                    return [
                        'id' => $activity->id,
                        'label' => $activity->name,
                        'description' => $activity->description,
                        'count' => $activity->tickets_count ?? 0, // Using the count from withCount
                    ];
                }),
            'activitySpecificationsPerActivity' => $this->activitySpecificationsPerActivity->map(function($activity) {
                    return [
                        'id' => $activity->id,
                        'activity' => $activity->name,
                        'specification' => $activity->activitySpecifications->map(function($spec) {
                            return [
                                'id' => $spec->id,
                                'activity' => $spec->activity->name,
                                'name' => $spec->name,
                                'description' => $spec->description,
                                'count' => $spec->tickets()->count(), // Count of tickets for this specification
                            ];
                        }),
                    ];
                }),
            'activitySpecifications' => $this->activitySpecifications->map(function($spec) {
                    return [
                        'id' => $spec->id,
                        'activity' => $spec->activity->name,
                        'name' => $spec->name,
                        'description' => $spec->description,
                        'count' => $spec->tickets_count ?? 0, // Count of tickets for this specification
                    ];
                }),
        ];
    }
}
