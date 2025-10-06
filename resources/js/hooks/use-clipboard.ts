// Credit: https://usehooks-ts.com/
import { useCallback, useEffect, useRef, useState } from 'react';

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>;

export function useClipboard(): [CopiedValue, CopyFn] {
    const [copiedText, setCopiedText] = useState<CopiedValue>(null);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current !== null) clearTimeout(timerRef.current);
        };
    }, []);

    const copy: CopyFn = useCallback(async (text) => {
        if (!navigator?.clipboard) {
            console.warn('Clipboard not supported');
            return false;
        }

        try {
            await navigator.clipboard.writeText(text);
            setCopiedText(text);

            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
            }

            timerRef.current = window.setTimeout(() => {
                setCopiedText(null);
                timerRef.current = null;
            }, 2000);

            return true;
        } catch (error) {
            console.warn('Copy failed', error);
            setCopiedText(null);
            return false;
        }
    }, []);

    return [copiedText, copy];
}
