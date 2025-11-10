<?php

namespace App\Http\Requests\Employee;

use App\Models\User;
use App\Rules\IsImageRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompleteEmployeeRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'avatar' => ['nullable', 'url', 'max:2048', new IsImageRule],
            'bio' => ['nullable', 'string', 'max:500'],

            // Personal info
            'first_name' => ['required', 'string', 'between:1,70'],
            'last_name' => ['required', 'string', 'between:1,70'],
            'gender' => ['required', 'string', 'between:1,50'],
            'date_of_birth' => ['required', 'date'],
            'phone_number' => ['required', 'string', 'between:1,20'],
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
