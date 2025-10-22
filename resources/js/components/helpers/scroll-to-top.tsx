import { Button } from '@/components/ui/button';
import { useDebounceCallback } from '@/hooks/use-debounce-callback';
import { ChevronsUpIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function scrollTopTop() {
    globalThis.document.documentElement.style.scrollBehavior = 'smooth';
    globalThis.document.body.scrollTop = 0;
    globalThis.document.documentElement.scrollTop = 0;
}

export default function ScrollToTop() {
    const [showScroll, setShowScroll] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const label = 'Scroll to top';

    function handleScroll() {
        const scrollTop =
            globalThis.window.pageYOffset ||
            globalThis.document.documentElement.scrollTop ||
            globalThis.document.body.scrollTop;

        setShowScroll(scrollTop > 30);
    }

    const debouncedHandleScroll = useDebounceCallback(handleScroll, 100);

    useEffect(() => {
        window.addEventListener('scroll', debouncedHandleScroll);
        return () => window.removeEventListener('scroll', debouncedHandleScroll);
    }, [debouncedHandleScroll]);

    return (
        showScroll && (
            <Button
                ref={buttonRef}
                onClick={scrollTopTop}
                variant="outline"
                size="icon-lg"
                className="fixed right-4 bottom-4 rounded-full"
                aria-label={label}
                title={label}
            >
                <ChevronsUpIcon aria-hidden />
            </Button>
        )
    );
}
