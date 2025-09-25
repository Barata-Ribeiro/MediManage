<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use App\Rules\IsImageRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserAccountRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],

            'avatar' => ['nullable', 'url', 'max:2048', new IsImageRule()],

            'bio' => ['nullable', 'string', 'max:500'],

            'roles' => ['nullable', 'array'],
            'roles.*' => ['string', 'exists:roles,name']
        ];
    }
}
