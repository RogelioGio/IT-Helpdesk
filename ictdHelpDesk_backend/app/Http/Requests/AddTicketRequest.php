<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "activity_id"=> "required|string|max:255|exists:activity,id,deleted_at,NULL",
            "activitySpecification_id"=> "required|string|max:255|exists:activityspecification,id,deleted_at,NULL",
            "assetSerialNumber"=> "required|string|max:255",
            "status_id"=> "required|string|max:255",
            "requester_id"=> "required|max:255",
            "description"=> "nullable|string|max:255",
        ];
    }
}
