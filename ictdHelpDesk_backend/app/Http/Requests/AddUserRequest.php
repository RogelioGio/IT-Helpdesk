<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddUserRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employeeID' => 'required|string|max:7|unique:users,employeeID',
             'firstName' => [
                'required',
                'string',
                'min:3',
                'max:75',
                'regex:/^(?=.*[a-zA-Z])[a-zA-Z\s\-]+$/'
            ],

            'middleName' => 'nullable|string|min:3|max:50',

             'lastName' => [
                'required',
                'string',
                'min:3',
                'max:75',
                'regex:/^(?=.*[a-zA-Z])[a-zA-Z\s\-]+$/'
            ],

            'username'   => 'required|string|min:3|unique:users,username',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|string|min:8',
            'designation' => 'required|string|min:5',
            'office_department_division_id' => 'required|exists:office_department_division,id',
            'account_role_id' => 'required|exists:accountroles,id',
        ];

    }
    public function messages(): array
    {
        return [

            // Min length
            'firstName.min' => 'First name must be at least 3 characters.',
            'middleName.min' => 'Middle name must be at least 3 characters.',
            'lastName.min' => 'Last name must be at least 3 characters.',
            'password.min' => 'Password must be at least 8 characters.',

            // Regex
            'firstName.regex' => 'Enter a valid first name.',
            'lastName.regex' => 'Enter a valid last name.',

            // Unique
            'employeeID.unique' => 'This Employee ID already exists.',
            'username.unique' => 'This username is already taken.',
            'email.unique' => 'This email is already registered.',

            // Exists
            'office_department_division_id.exists' => 'Selected office department division is invalid.',
            'account_role_id.exists' => 'Selected account role is invalid.',
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
