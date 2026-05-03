<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

public function rules(): array
{
    
    $userId = $this->route('user') ?? $this->route('id');

    return [
        'employeeID'  => ['sometimes', 'string', 'max:7', Rule::unique('users')->ignore($userId)],
        'firstName'   => 'sometimes|string|max:75|min:3|regex:/^(?=.*[a-zA-Z])[a-zA-Z\s\-]+$/',
        'middleName'  => 'nullable|string|max:75|min:3', //optional
        'lastName'   => 'sometimes|string|max:75|min:3|regex:/^(?=.*[a-zA-Z])[a-zA-Z\s\-]+$/',
        'username'    => ['sometimes', 'string', Rule::unique('users')->ignore($userId)],
        'email'       => ['sometimes', 'email', Rule::unique('users')->ignore($userId)],
        'password'    => 'sometimes|nullable|string|min:8', //Optional
        'designation' => 'nullable|string',
        'office_department_division_id' => 'sometimes|exists:office_department_division,id',
        'account_role_id'               => 'sometimes|exists:accountroles,id',
    ];
}
   public function attributes(): array
    {
        return [
            'employeeID' => 'employee id',
            'firstName' => 'first name',
            'middleName' => 'middle name',
            'lastName' => 'last name',
            'username' => 'username',
            'email' => 'email address',
            'password' => 'password',
            'designation' => 'designation',
            'office_department_division_id' => 'office department division',
            'account_role_id' => 'account role',
        ];
    }

}