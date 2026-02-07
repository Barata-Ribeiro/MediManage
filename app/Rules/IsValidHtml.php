<?php

namespace App\Rules;

use Closure;
use DOMDocument;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class IsValidHtml implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || trim($value) === '') {
            $fail('The :attribute must be a non-empty string.');

            return;
        }

        libxml_use_internal_errors(true);
        $doc = new DOMDocument;

        $loaded = $doc->loadHTML('<?xml encoding="utf-8" ?>'.$value, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        $errors = libxml_get_errors();
        libxml_clear_errors();
        libxml_use_internal_errors(false);

        if (! $loaded || ! empty($errors)) {
            $fail('The :attribute contains invalid HTML.');
        }
    }
}
