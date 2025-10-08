<?php

namespace App\Http\Requests\Article;

use App\Rules\IsImageRule;
use App\Rules\IsValidHtml;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ArticleRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['required', 'string', 'max:255'],
            'excerpt' => ['required', 'string', 'max:500'],
            'content_html' => ['required', 'string', new isValidHtml()],
            'content_json' => ['nullable', 'string', 'json'],
            'thumbnail' => ['required', 'url', 'max:2048', new IsImageRule()],
            'is_published' => ['required', 'boolean'],
            'categories' => ['nullable', 'array'],
        ];
    }
}
