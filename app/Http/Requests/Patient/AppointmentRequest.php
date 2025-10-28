<?php

namespace App\Http\Requests\Patient;

use Illuminate\Foundation\Http\FormRequest;

class AppointmentRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'patient_info_id' => 'required|integer|exists:patient_infos,id',
            'employee_info_id' => 'required|integer|exists:employee_infos,id',
            'appointment_date' => 'required|date|after:now',
            'reason_for_visit' => 'required|string|max:500',
        ];
    }
}
