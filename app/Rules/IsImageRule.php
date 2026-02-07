<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;
use Log;

class IsImageRule implements ValidationRule
{
    private const ERROR_MESSAGE = 'The :attribute must be a valid image URL.';

    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

        if (! filter_var($value, FILTER_VALIDATE_URL)) {
            Log::warning('Invalid URL format', ['url' => $value]);
            $fail(self::ERROR_MESSAGE);

            return;
        }

        // Using cURL to set a browser-like User\-Agent and follow redirects
        $ch = curl_init($value);
        curl_setopt_array($ch, [
            CURLOPT_NOBODY => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 5,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
        ]);

        curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
        $curlErr = curl_error($ch);
        curl_close($ch);

        Log::info('Verifying Headers via cURL', ['url' => $value, 'http_code' => $httpCode, 'content_type' => $contentType, 'curl_error' => $curlErr]);

        if ($httpCode >= 400 || empty($contentType)) {
            Log::warning('Failed to retrieve content type or HTTP error', ['url' => $value, 'http_code' => $httpCode]);
            $fail(self::ERROR_MESSAGE);

            return;
        }

        $contentType = strtolower(explode(';', $contentType)[0]);

        if (! in_array($contentType, $allowedMimeTypes, true)) {
            $fail(self::ERROR_MESSAGE);
        }
    }
}
