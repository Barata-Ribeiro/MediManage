import { useEffect, useState } from 'react';

interface UseIsMobileReturn {
    isMobile: boolean;
    isLoading: boolean;
}

const MOBILE_BREAKPOINT = 768;

/**
 * useIsMobile
 *
 * React hook that determines whether the current environment should be considered a mobile device.
 *
 * Detection strategy:
 * - Primary: evaluates a media query using the MOBILE_BREAKPOINT constant (`(max-width: ${MOBILE_BREAKPOINT}px)`).
 * - Secondary: checks navigator.userAgent for common mobile keywords (android, iphone, ipad, etc.) and also verifies
 *   `window.innerWidth <= 768` when the user-agent hint is present.
 * - The media query check is prioritized, but the user-agent check is used as an additional heuristic.
 *
 * Behavior:
 * - Returns an object with `isMobile` (boolean) and `isLoading` (boolean).
 * - `isLoading` is true initially until the first client-side detection completes.
 * - Subscribes to media query "change" events and to `window.resize` to update results dynamically.
 * - Cleans up all listeners on unmount.
 * - Uses feature detection to support both modern (`addEventListener`/`removeEventListener`) and older
 *   (`addListener`/`removeListener`) media query APIs.
 *
 * Notes:
 * - This hook depends on `globalThis.window` and `navigator` and therefore only performs detection on the client.
 *   On server-side renders it will not run and the initial state will reflect the hook's initial values (isMobile: false,
 *   isLoading: true) until hydration.
 * - If you need deterministic server-side behavior, provide a server-side hint or avoid relying on `isMobile` during SSR.
 *
 * @returns {UseIsMobileReturn} An object containing:
 *  - isMobile: boolean — true if the current environment is considered mobile.
 *  - isLoading: boolean — true while the initial detection is in progress.
 *
 * @example
 * const { isMobile, isLoading } = useIsMobile();
 *
 * if (!isLoading && isMobile) {
 *   // render mobile-specific UI
 * }
 */
export const useIsMobile = (): UseIsMobileReturn => {
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkIsMobile = () => {
            // Check using media query
            const mediaQuery = globalThis.window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

            // Check using user agent (additional detection)
            const userAgent = navigator.userAgent.toLowerCase();
            const mobileKeywords = [
                'android',
                'webos',
                'iphone',
                'ipad',
                'ipod',
                'blackberry',
                'windows phone',
                'mobile',
            ];

            const isMobileUA = mobileKeywords.some((keyword) => userAgent.includes(keyword));

            // Combine both checks - prioritize media query but consider user agent
            const isMobileDevice = mediaQuery.matches || (isMobileUA && globalThis.window.innerWidth <= 768);

            setIsMobile(isMobileDevice);
            setIsLoading(false);
        };

        // Initial check
        checkIsMobile();

        // Listen for media query changes
        const mediaQuery = globalThis.window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
        const handleChange = () => checkIsMobile();

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
        } else {
            // Fallback for older browsers
            mediaQuery.addListener(handleChange);
        }

        // Listen for window resize
        globalThis.window.addEventListener('resize', checkIsMobile);

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleChange);
            } else {
                mediaQuery.removeListener(handleChange);
            }
            globalThis.window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

    return {
        isMobile,
        isLoading,
    };
};

export default useIsMobile;
