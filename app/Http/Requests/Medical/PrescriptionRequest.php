<?php

namespace App\Http\Requests\Medical;

use App\Rules\IsValidHtml;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PrescriptionRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'prescription_details_html' => ['required', 'string', new isValidHtml],
            'prescription_details_json' => ['nullable', 'string', 'json'],
            'date_expires' => ['nullable', 'date', 'after:today'],
        ];
    }
}
