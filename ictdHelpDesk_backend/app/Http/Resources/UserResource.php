<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
public function toArray($request): array
{
    return [
        'id'          => $this->id,
        'employeeID'  => $this->employeeID,
        'firstName'   => $this->firstName,
        'middleName'  => $this->middleName??"",
        'lastName'    => $this->lastName,
        'username'    => $this->username,
        'email'       => $this->email,
        'account_role_id' => $this->account_role_id,
        'designation' => $this->designation,
        'office_department_division' => [
            'officeCode' => $this->office_department_division ? $this->office_department_division->officeCode : "N/A",
            'id' => $this->office_department_division_id,
            'name' => $this->office_department_division ? $this->office_department_division->name : "N/A",
        ],
        'accountroles' => [
            'id' => $this->account_role_id,
            'name' => $this->account_role ? $this->account_role->name : 'No Role Found',
        ],
        'assigned_tickets' => $this->AssignedTickets->count() > 0 ? TicketResource::collection($this->AssignedTickets) : [],
        'assignedTicket_statistics' => $this->AssignedTickets->count() > 0 ?  $this->AssignedTickets->groupBy(fn($item) => $item->status->id)
        ->map(function($group) {
            return [
                'label' => $group->first()->status ? $group->first()->status->name : 'No Critical Level',
                'count' => $group->count(),
            ];
        })->values() : [],
    ];

}
    public function with($request): array
    {
        return [
            'success' => true,
        ];
    }

}
