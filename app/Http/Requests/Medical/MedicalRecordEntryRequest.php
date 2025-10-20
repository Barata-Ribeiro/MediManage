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
            'content_html' => ['required', 'string', new IsValidHtml()],
            'content_json' => ['nullable', 'string', 'json'],
            'entry_type' => ['required', 'string', 'max:255', 'in:allergy,diagnosis,observation,note,vitals,immunization,lab_result,treatment,procedure,other'],
            'is_visible_to_patient' => ['required', 'boolean'],
        ];
    }
}
