import { Button } from '@/components/ui/button';
import useIsMounted from '@/hooks/use-is-mounted';
import { Notice } from '@/types/application/notice';
import { ChevronsLeft, ChevronsRight, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AppNoticeProps {
    notices?: Notice[];
}

const STORAGE_KEY = 'app_notice_dismissed_v1';

export default function AppNotice({ notices }: Readonly<AppNoticeProps>) {
    const [index, setIndex] = useState(0);
    const [dismissed, setDismissed] = useState(false);
    const isMounted = useIsMounted();

    // read dismissed state from localStorage (only on client)
    useEffect(() => {
        if (!isMounted) return;

        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === '1') setDismissed(true);
    }, [isMounted]);

    // clamp index if notices change
    useEffect(() => {
        if (!notices || notices.length === 0) {
            setIndex(0);
            return;
        }

        setIndex((i) => (i >= notices.length ? 0 : i));
    }, [notices]);

    const prev = () => setIndex((i) => (notices?.length ? (i - 1 + notices.length) % notices.length : 0));
    const next = () => setIndex((i) => (notices?.length ? (i + 1) % notices.length : 0));

    const dismiss = () => {
        setDismissed(true);
        if (!isMounted) return;
        localStorage.setItem(STORAGE_KEY, '1');
    };

    if (!notices || notices.length === 0) return null;
    if (dismissed) return null;

    const current = notices[index];

    const title = current?.title ?? 'Notice';

    const nextLabel = 'Go to next notice';
    const previousLabel = 'Go to previous notice';
    const dismissLabel = 'Dismiss notice';

    return (
        <div className="bg-foreground text-background" aria-label="Application notices">
            <div className="container flex items-center gap-4 py-2 text-sm">
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={prev}
                        title={previousLabel}
                        aria-label={previousLabel}
                        aria-controls="app-notice-content"
                    >
                        <ChevronsLeft aria-hidden size={16} />
                    </Button>

                    <div
                        className="flex flex-col"
                        id="app-notice-content"
                        aria-live="polite"
                        aria-atomic="true"
                        aria-label={`${title} (${index + 1} of ${notices.length})`}
                    >
                        <span className="leading-tight font-semibold text-background" aria-level={3}>
                            {title}
                        </span>
                        <p className="text-sm leading-snug text-background/90">{current.description}</p>
                    </div>
                </div>

                <div className="ml-auto flex flex-col items-center gap-2 lg:flex-row">
                    <span
                        className="order-3 shrink-0 text-xs whitespace-nowrap text-background/80 lg:order-1"
                        aria-hidden
                    >
                        {index + 1} / {notices.length}
                    </span>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={next}
                        title={nextLabel}
                        aria-label={nextLabel}
                        aria-controls="app-notice-content"
                        className="order-2 lg:order-2"
                    >
                        <ChevronsRight aria-hidden size={16} />
                    </Button>

                    <button
                        type="button"
                        onClick={dismiss}
                        title={dismissLabel}
                        aria-label={dismissLabel}
                        className="order-1 size-auto cursor-pointer hover:text-muted lg:order-3"
                    >
                        <XIcon aria-hidden size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}
