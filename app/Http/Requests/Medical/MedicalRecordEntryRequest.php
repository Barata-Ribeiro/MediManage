<?php

namespace App\Http\Requests\Medical;

use App\Rules\IsValidHtml;
use Illuminate\Foundation\Http\FormRequest;

class MedicalRecordEntryRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content_html' => ['required', 'string', new IsValidHtml],
            'content_json' => ['nullable', 'string', 'json'],
            'entry_type' => ['required', 'string', 'max:255', 'in:allergy,diagnosis,observation,note,vitals,immunization,lab_result,treatment,procedure,other'],
            'is_visible_to_patient' => ['required', 'boolean'],
            'appointment_id' => ['required_if:appointment_id,!=,null', 'integer', 'exists:appointments,id'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'appointment_id.required_if' => 'The appointment field is required when an appointment is selected.',
            'appointment_id.exists' => 'The selected appointment is invalid.',
        ];
    }
}
