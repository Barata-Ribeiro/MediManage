<?php

namespace App\Http\Requests\Medical;

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
            'patient_info_id' => ['required', 'exists:patient_info,id'],
            'medical_notes' => ['required', 'string', 'min:10'],
        ];
    }
}
