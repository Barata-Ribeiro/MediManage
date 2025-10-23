import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Notice } from '@/types/application/notice';
import { ChevronLeftIcon, ChevronRightIcon, MessageSquareWarningIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

interface AppNoticeProps {
    notices?: Notice[];
}

export default function AppNotice({ notices }: Readonly<AppNoticeProps>) {
    const [index, setIndex] = useState(0);

    useEffect(() => setIndex(0), [notices]);

    const prev = () => {
        setIndex((i) => (notices?.length ? (i - 1 + notices.length) % notices.length : 0));
    };

    const next = () => {
        setIndex((i) => (notices?.length ? (i + 1) % notices.length : 0));
    };

    if (!notices || notices.length === 0) return null;

    const current = notices[index];

    return (
        <div className="fixed top-22 z-30 flex w-full justify-center p-4">
            <div className="grid max-w-4xl">
                <Alert>
                    <MessageSquareWarningIcon aria-hidden className="mt-1 shrink-0" />
                    <AlertTitle>{current.title}</AlertTitle>
                    <AlertDescription>{current.description}</AlertDescription>
                </Alert>

                <div className="flex items-center justify-end gap-x-2 pt-2">
                    <Button type="button" variant="ghost" aria-label="Previous notice" onClick={prev} size="icon">
                        <ChevronLeftIcon aria-hidden />
                    </Button>

                    <span className="text-sm text-slate-600" aria-live="polite">
                        {index + 1}/{notices.length}
                    </span>

                    <Button type="button" aria-label="Next notice" onClick={next} variant="ghost" size="icon">
                        <ChevronRightIcon aria-hidden />
                    </Button>
                </div>
            </div>
        </div>
    );
}
