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
