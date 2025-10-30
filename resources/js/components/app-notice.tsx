import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Notice } from '@/types/application/notice';
import { ChevronLeftIcon, ChevronRightIcon, MessageSquareWarningIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';

interface AppNoticeProps {
    notices?: Notice[];
}

export default function AppNotice({ notices }: Readonly<AppNoticeProps>) {
    const [index, setIndex] = useState(0);
    const [closed, setClosed] = useState(false);

    useEffect(() => {
        setIndex(0);
        setClosed(false);
    }, [notices]);

    const prev = () => {
        setIndex((i) => (notices?.length ? (i - 1 + notices.length) % notices.length : 0));
    };

    const next = () => {
        setIndex((i) => (notices?.length ? (i + 1) % notices.length : 0));
    };

    if (!notices || notices.length === 0) return null;

    const current = notices[index];

    if (closed) return null;

    return (
        <div className="fixed top-22 z-50 flex w-full justify-center p-4">
            <div className="relative grid max-w-4xl">
                <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label="Close notice"
                    title="Close notice"
                    className="absolute -top-6 -right-6"
                    onClick={() => setClosed(true)}
                >
                    <XIcon aria-hidden />
                </Button>

                <Alert>
                    <MessageSquareWarningIcon aria-hidden className="mt-1 shrink-0" />
                    <AlertTitle>{current.title}</AlertTitle>
                    <AlertDescription>{current.description}</AlertDescription>
                </Alert>

                <div className="flex items-center justify-end gap-x-2 pt-2">
                    <Button type="button" variant="ghost" aria-label="Previous notice" onClick={prev} size="icon">
                        <ChevronLeftIcon aria-hidden />
                    </Button>

                    <Badge variant="outline" className="bg-muted text-sm select-none" aria-live="polite">
                        {index + 1}/{notices.length}
                    </Badge>

                    <Button type="button" aria-label="Next notice" onClick={next} variant="ghost" size="icon">
                        <ChevronRightIcon aria-hidden />
                    </Button>
                </div>
            </div>
        </div>
    );
}
