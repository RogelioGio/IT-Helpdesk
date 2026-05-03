<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest
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
        'description' => 'sometimes|string|max:255',
        'status_id'   => 'sometimes|exists:ticketstatus,id',
        'priority_id' => 'sometimes|exists:ticketrelevance,id',
        'findings'    => 'nullable|string',
        'resolution'  => 'nullable|string',
        'assetSerialNumber' => 'sometimes|string|max:100',
        ];
    }
}
