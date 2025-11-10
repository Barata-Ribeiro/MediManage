<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Account info
            'name' => ['required', 'string', 'max:255', 'unique:users,name'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],

            // Personal info
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'string', 'max:50'],
            'date_of_birth' => ['required', 'date'],
            'phone_number' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:255'],

            // Doctor specific info
            'registration_number' => ['nullable', 'required_with_all:registration_origin,specialization,license_number,license_expiry_date', 'string', 'max:100'],
            'registration_origin' => ['nullable', 'required_with_all:registration_number,specialization,license_number,license_expiry_date', 'string', 'max:255'],
            'specialization' => ['nullable', 'required_with_all:registration_number,registration_origin,license_number,license_expiry_date', 'string', 'max:255'],
            'license_number' => ['nullable', 'required_with_all:registration_number,registration_origin,specialization,license_expiry_date', 'string', 'max:100'],
            'license_expiry_date' => ['nullable', 'required_with_all:registration_number,registration_origin,specialization,license_number', 'date', 'after:today'],

            // Employment info
            'position' => ['required', 'string', 'max:100'],
            'is_active' => ['required', 'boolean'],
            'hire_date' => ['required', 'date'],
            'termination_date' => ['nullable', 'date', 'after:hire_date'],
        ];
    }
}
