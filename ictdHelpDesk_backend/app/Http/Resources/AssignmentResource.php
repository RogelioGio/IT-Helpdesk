<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssignmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
{
    return [
        'id' => $this->id,
        'created_at' => $this->created_at,
        'related_ticket' => [
            'id' => $this->ticket?->id,
            'subject' => $this->ticket?->subject,
        ],
        'assigned_user' => [
            'id' => $this->user?->id,
            'name' => $this->user?->name,
        ]
    ];
}
    public function with($request): array
    {
        return [
            'success' => true,
        ];
    }
}
