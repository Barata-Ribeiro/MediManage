import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function buildParams(overrides: Record<string, string | number | boolean | undefined> = {}) {
    const params: Record<string, string | number | boolean | undefined> = {};

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.forEach((value, key) => {
        params[key] = value;
    });

    Object.keys(overrides).forEach((k) => {
        const v = overrides[k];

        if (v === undefined || v === null || v === '') delete params[k];
        else params[k] = v;
    });

    return params;
}

export function normalizeString(str: string) {
    return str
        .toLowerCase()
        .trim()
        .normalize('NFD') // Normalize to decomposed form
        .replaceAll(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replaceAll(/[_\-\s]+/g, ' ') // convert underscores, dashes and repeated whitespace to single space
        .replaceAll(/[^\p{L}\p{N} ]+/gu, '') // Remove non-letter/number characters (keep spaces) - Unicode aware
        .replaceAll(/(^|\s)\p{L}/gu, (match) => match.toUpperCase()); // Capitalize first letter of each word - Unicode aware
}
