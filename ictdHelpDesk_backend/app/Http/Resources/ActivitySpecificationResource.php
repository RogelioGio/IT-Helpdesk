<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivitySpecificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->activitySpecificationCode,
            'related_activity' => [
                'id' => $this->activity ? $this->activity->id : null,
                'name' => $this->activity ? $this->activity->name : null,
            ],
        ];
    }

    public function with($request): array
        {
            return [
                'success' => true,
            ];
        }
}
