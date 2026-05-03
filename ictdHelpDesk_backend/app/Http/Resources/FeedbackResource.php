<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeedbackResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $ticket = $this->ticket()->with(['requester', 'responder', 'activity', 'activityspecification', 'priority', 'status'])->first();
        return [
            'id' => $this->id,
            'ticket' => [
                'id'        => $ticket->id,
                'title'     => $ticket->title,
                'requester' => [
                    'id'          => $ticket->requester->id,
                    'name'        => trim("{$ticket->requester->firstName} {$ticket->requester->middleName} {$ticket->requester->lastName}"),
                    'employee_id' => $ticket->requester->employeeID,
                ],
                // Fixed the map closure and commas here
                'responders' => $ticket->responder->map(function ($user) {
                    return [
                        'id'          => $user->id,
                        'name'        => trim("{$user->firstName} {$user->middleName} {$user->lastName}"),
                        'employee_id' => $user->employeeID,
                    ];
                }),
                'activity' => $ticket->activity ? [
                    'id'   => $ticket->activity->id,
                    'name' => $ticket->activity->name,
                ] : null,
                'activity_specification' => $ticket->activityspecification ? [
                    'id'   => $ticket->activityspecification->id,
                    'name' => $ticket->activityspecification->name,
                ] : null,
                'priority' => $ticket->priority ? [
                    'id'    => $ticket->priority->id,
                    'level' => $ticket->priority->name,
                ] : null,
                'status' => $ticket->status ? [
                    'id'   => $ticket->status->id,
                    'name' => $ticket->status->name,
                ] : null,
            ],
            'suggestion'   => $this->suggestion,
            'commendation' => $this->commendation,
            'complaint'    => $this->complaint,
            'dimensions'   => FeedbackDimensionResource::collection($this->whenLoaded('dimensions')),
        ];
    }
}
