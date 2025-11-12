import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { PaginationMeta } from '@/types';

interface PaginationProps {
    pagination: Omit<PaginationMeta<null>, 'data'>;
}

export default function AppPagination({ pagination }: Readonly<PaginationProps>) {
    const { isMobile } = useIsMobile();

    const filteredLinks = pagination.links.filter((link) => {
        if (link.label === '...') return true;

        const labelStr = String(link.label || '');
        if (/previous|next|laquo|raquo/i.test(labelStr)) return false;

        if (typeof link.page === 'number') {
            if (!isMobile) return true;

            const p = link.page;
            const current = pagination.current_page;
            const last = pagination.last_page;
            if (p === 1 || p === last) return true;
            return Math.abs(p - current) <= 1;
        }

        return false;
    });

    const prevDisabled = !pagination.prev_page_url;
    const nextDisabled = !pagination.next_page_url;

    if (pagination.last_page <= 1) {
        return (
            <p className="border-t pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                You are viewing all {pagination.total} {pagination.total === 1 ? 'item' : 'items'}.
            </p>
        );
    }

    return (
        <Pagination className="grid border-t pt-6">
            <div className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium">{pagination.from}</span> to{' '}
                <span className="font-medium">{pagination.to}</span> of{' '}
                <span className="font-medium">{pagination.total}</span> results
            </div>

            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={pagination.prev_page_url}
                        aria-disabled={prevDisabled}
                        tabIndex={prevDisabled ? -1 : undefined}
                        className={cn(prevDisabled && 'pointer-events-none opacity-50')}
                    />
                </PaginationItem>

                {filteredLinks.map((link, idx) => {
                    const key = `${String(link.label)}-${link.page ?? 'null'}-${idx}`;

                    if (link.label === '...') {
                        return (
                            <PaginationItem key={key}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    const isActive = !!link.active;
                    const disabled = !link.url;

                    return (
                        <PaginationItem key={key}>
                            <PaginationLink
                                href={link.url}
                                isActive={isActive}
                                aria-disabled={disabled}
                                tabIndex={disabled ? -1 : undefined}
                                className={cn(disabled && 'pointer-events-none opacity-50')}
                            >
                                {link.page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                <PaginationItem>
                    <PaginationNext
                        href={pagination.next_page_url}
                        aria-disabled={nextDisabled}
                        tabIndex={nextDisabled ? -1 : undefined}
                        className={cn(nextDisabled && 'pointer-events-none opacity-50')}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
