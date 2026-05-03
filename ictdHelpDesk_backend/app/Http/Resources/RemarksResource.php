<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RemarksResource extends JsonResource
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
            'body' => $this->body,
            'remarkBy' => $this->user ? [
                'id' => $this->user->id,
                'firstName' => $this->user->firstName,
                'middleName' => $this->user->middleName ? $this->user->middleName : "",
                'lastName' => $this->user->lastName,
                'username' => $this->user->username,
                'account_role_id' => $this->user->account_role_id,
                'designation' => $this->user->designation,
                'office_department_division' => [
                    'officeCode' => $this->user->office_department_division ? $this->user->office_department_division->officeCode : "N/A",
                    'id' => $this->user->office_department_division_id,
                    'name' => $this->user->office_department_division ? $this->user->office_department_division->name : "N/A",
                ],
                'accountroles' => [
                    'id' => $this->user->account_role_id,
                    'name' => $this->user->account_role ? $this->user->account_role->name : 'No Role Found',
                ]
            ] : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
