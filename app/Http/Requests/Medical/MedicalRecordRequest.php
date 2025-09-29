<?php

namespace App\Http\Requests\Medical;

use App\Rules\IsValidHtml;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class MedicalRecordRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'patient_info_id' => ['required', 'exists:patient_info,id', 'unique:medical_records,patient_info_id'],
            'medical_notes_html' => ['required', 'string', new isValidHtml()],
            'medical_notes_json' => ['nullable', 'string', 'json'],
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
            'patient_info_id.exists' => 'The selected patient information does not exist.',
            'patient_info_id.unique' => 'A medical record for this patient already exists.',
        ];
    }
}
