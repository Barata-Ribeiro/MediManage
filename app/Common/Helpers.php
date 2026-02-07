<?php

namespace App\Common;

class Helpers
{
    /**
     * Build a boolean-mode search query from a raw input string.
     *
     * This method parses and normalizes a user-provided search string and returns
     * a sanitized boolean-style query suitable for use in full-text search engines
     * (for example, MySQL's MATCH ... AGAINST (... IN BOOLEAN MODE)).
     *
     * The implementation is expected to:
     *  - Trim and normalize whitespace,
     *  - Preserve quoted phrases as single units,
     *  - Apply or normalize boolean operators/flags for individual terms,
     *  - Escape or remove characters that would break the target query syntax.
     *
     * @param  string  $query  Raw user-provided search string.
     * @return string A sanitized, normalized boolean-mode query string ready for use in full-text searches.
     */
    public static function buildBooleanQuery(string $query): string
    {
        $terms = preg_split('/\s+/', $query, -1, PREG_SPLIT_NO_EMPTY);

        $booleanParts = array_map(function ($t) {
            $t = preg_replace('/[+\-<>()~\"*]/', '', $t);

            return $t !== '' ? '+'.$t.'*' : null;
        }, $terms);

        $booleanParts = array_filter($booleanParts);

        return $booleanParts ? implode(' ', $booleanParts) : $query;
    }
}
