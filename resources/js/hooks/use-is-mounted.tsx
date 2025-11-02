import { useEffect, useRef } from 'react';

/**
 * Hook that provides a stable check for whether the component is currently mounted.
 *
 * This is useful to avoid performing state updates or other side effects after a component
 * has unmounted (for example, when resolving promises or handling async callbacks).
 * The returned function is stable across renders and reads an internal ref that is set
 * to true on mount and false on unmount.
 *
 * Example:
 * const isMounted = useIsMounted();
 * useEffect(() => {
 *   let cancelled = false;
 *   async function load() {
 *     const result = await fetchData();
 *     if (isMounted()) { // only update state if still mounted
 *       setData(result);
 *     }
 *   }
 *   load();
 * }, []);
 *
 * @returns A function that returns true if the component is currently mounted, otherwise false.
 */
export function useIsMounted(): () => boolean {
    const isMountedRef = useRef<boolean>(false);

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return () => isMountedRef.current;
}

export default useIsMounted;
