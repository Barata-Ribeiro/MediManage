<?php

namespace App\Http\Requests\Patient;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PatientRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'string', 'max:50'],
            'date_of_birth' => ['required', 'date'],
            'phone_number' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:255'],

            'insurance_company' => ['required', 'string', 'max:255'],
            'insurance_member_id_number' => ['required', 'string', 'max:100'],
            'insurance_group_number' => ['required', 'string', 'max:100'],
            'insurance_policy_number' => ['required', 'string', 'max:100'],

            'emergency_contact_name' => ['nullable', 'required_with:emergency_contact_relationship,emergency_contact_phone_number', 'string', 'max:255'],
            'emergency_contact_relationship' => ['nullable', 'required_with:emergency_contact_name,emergency_contact_phone_number', 'string', 'max:50'],
            'emergency_contact_phone_number' => ['nullable', 'required_with:emergency_contact_name,emergency_contact_relationship', 'string', 'max:20'],

            'current_medications' => ['nullable', 'string', 'max:255'],
            'past_illnesses' => ['nullable', 'string', 'max:255'],
            'surgeries' => ['nullable', 'string', 'max:255'],
            'family_medical_history' => ['nullable', 'string', 'max:255'],
        ];
    }
}
