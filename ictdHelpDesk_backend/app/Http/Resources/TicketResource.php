<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketResource extends JsonResource
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
                'ticketId' => $this->ticketId,
                'activity' => [
                    'id' => $this->activity_id ? $this->activity_id : 'N/A',
                    'name' => $this->activity->name ? $this->activity->name ?? 'N/A' : 'N/A',
                ],
                'activitySpecification' => [
                    'id' => $this->activitySpecification_id ? $this->activitySpecification_id : 'N/A',
                    'name' => $this->activitySpecification ? $this->activitySpecification->name ?? 'N/A' : 'N/A'
                ],
                'requester' => [
                    'id' => $this->requester_id ? $this->requester_id : 'N/A',
                    'name' => $this->requester ? $this->requester->firstName . ' ' . $this->requester->lastName : 'N/A',
                    'accountRole' => $this->requester && $this->requester->account_role ? $this->requester->account_role->name : 'N/A',
                    'office_department_division' => [
                        'id' => $this->requester && $this->requester->office_department_division ? $this->requester->office_department_division->id : 'N/A',
                        'name' => $this->requester && $this->requester->office_department_division ? $this->requester->office_department_division->name : 'N/A',
                        'officeCode' => $this->requester && $this->requester->office_department_division ? $this->requester->office_department_division->officeCode : 'N/A',
                    ]
                ],
                "assetNumber" => $this->assetSerialNumber ? $this->assetSerialNumber : 'N/A',
                'priority' => [
                    'id' => $this->priority_id ? $this->priority_id : null,
                    'name' => $this->priority ? $this->priority->name : 'No Critical Level',
                ],
                'timeline' => $this->timeline ? $this->timeline->map(function($status) {
                    return [
                        'name' => $status->name?? 'N/A',
                        'created_at' => $status->pivot->created_at,
                        'updated_at' => $status->pivot->updated_at,
                        'user' => [
                            'id' => $status->pivot->user_id,
                            'name' => $status->pivot->user ? $status->pivot->user->firstName . ' ' . $status->pivot->user->lastName : 'N/A',
                        ]
                    ];
                }) : [],
                'latestTimelineStatus' => $this->timeline && $this->timeline->last() ? [
                    'name' => $this->timeline->last()->name,
                    'created_at' => $this->timeline->last()->pivot->created_at,
                    'updated_at' => $this->timeline->last()->pivot->updated_at,
                    'user' => [
                        'id' => $this->timeline->last()->pivot->user_id,
                        'name' => $this->timeline->last()->pivot->user ? $this->timeline->last()->pivot->user->firstName . ' ' . $this->timeline->last()->pivot->user->lastName : 'N/A',
                    ]
                ] : [],
                'assignment' => $this->responder && $this->responder->count() > 0 ? $this->responder->map(function($responder) {
                    return [
                        'id' => $responder->id,
                        'name' => $responder->firstName . ' ' . $responder->lastName,
                        'office_department_division' => [
                            'id' => $responder->office_department_division ? $responder->office_department_division->id : 'N/A',
                            'name' => $responder->office_department_division ? $responder->office_department_division->name : 'N/A',
                            'officeCode' => $responder->office_department_division ? $responder->office_department_division->officeCode : 'N/A',
                        ],
                        'accountRole' => $responder->account_role ? $responder->account_role->name : 'N/A',
                        'designation' => $responder->designation ? $responder->designation : 'N/A',
                    ];
                }) : [],
                'assignmentRequests' => $this->requests ? $this->requests->map(function($request) {
                    return [
                        'id' => $request->id,
                        'user' => [
                            'id' => $request->user_id,
                            'name' => $request->user ? $request->user->firstName . ' ' . $request->user->lastName : 'N/A',
                            'accountRole' => $request->user && $request->user->account_role ? $request->user->account_role->name : 'N/A',
                            'designation' => $request->user && $request->user->designation ? $request->user->designation : 'N/A',
                            'office_department_division' => [
                                'id' => $request->user && $request->user->office_department_division ? $request->user->office_department_division->id : 'N/A',
                                'name' => $request->user && $request->user->office_department_division ? $request->user->office_department_division->name : 'N/A',
                                'officeCode' => $request->user && $request->user->office_department_division ? $request->user->office_department_division->officeCode : 'N/A',
                            ]
                        ],
                        'created_at' => $request->created_at,
                    ];
                }) : [],
                'feedback' => $this->feedback ? [
                    'id' => $this->feedback->id,
                ] : [],
                'resolution' => $this->resolution ? $this->resolution : 'N/A',
                'findings' => $this->findings ? $this->findings : 'N/A',
                'remarks' => $this->remarks ? RemarksResource::collection($this->remarks) : [],
                'cancellation_reason' => $this->cancelReasons ? $this->cancelReasons->map(function($reason) {
                    return [
                        'id' => $reason->id,
                        'name' => $reason->reason,
                        'custom_reason' => $reason->pivot->custom_reason
                    ];
                }) : 'N/A',
                'status' => [
                    'id' => $this->status_id ? $this->status_id : 'N/A',
                    'name' => $this->status ? $this->status->name : 'N/A',
                ],
                'description' => $this->description,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
                'dateClosed' => $this->dateClosed ? $this->dateClosed : 'N/A',
                'assignmentDate' => $this->assignementDate ? $this->assignementDate : 'N/A',
                'respondedDate' => $this->respondedDate ? $this->respondedDate : 'N/A',
        ];
    }
}
