import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { buildParams } from '@/lib/utils';
import { PaginationMeta } from '@/types';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface DataTablePaginationProps<TData> {
    pagination: PaginationMeta<TData>;
}

export function DataTablePagination<TData>({ pagination }: Readonly<DataTablePaginationProps<TData>>) {
    const goToUrl = (url?: string | null) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, replace: true });
    };

    const goToPage = (page: number) => {
        router.get(pagination.path, buildParams({ page }), { preserveState: true, replace: true });
    };

    const createPageRange = (current: number, last: number, delta = 2) => {
        if (last <= 1) return [1];
        const range: (number | string)[] = [];
        const left = Math.max(2, current - delta);
        const right = Math.min(last - 1, current + delta);

        range.push(1);
        if (left > 2) range.push('...');

        for (let i = left; i <= right; i++) {
            range.push(i);
        }

        if (right < last - 1) range.push('...');
        if (last > 1) range.push(last);

        return range;
    };

    const renderPageLinks = () => {
        const items = createPageRange(pagination.current_page, pagination.last_page);

        return items.map((item) => {
            if (typeof item === 'string') {
                return (
                    <span key={`ellipsis-${item}`} className="px-2 text-sm text-muted-foreground">
                        {item}
                    </span>
                );
            }

            const pageNumber = item;
            const serverLink = pagination.links.find((l) => l.page === pageNumber && l.url);
            const isActive = pageNumber === pagination.current_page;

            return (
                <Button
                    key={`page-${pageNumber}-${item}`}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => (serverLink ? goToUrl(serverLink.url) : goToPage(pageNumber))}
                    disabled={isActive}
                    aria-current={isActive ? 'page' : undefined}
                    className="h-8 min-w-9 px-2"
                >
                    {pageNumber}
                </Button>
            );
        });
    };

    return (
        <div className="flex flex-col items-center justify-between gap-y-3 px-2 sm:flex-row">
            <div className="flex-1 text-sm text-muted-foreground">
                Showing {pagination.from} to {pagination.to} of {pagination.total} results
            </div>
            <div className="flex flex-col items-center gap-x-6 gap-y-3 sm:flex-row lg:gap-x-8">
                <div className="flex items-center gap-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${pagination.per_page}`}
                        onValueChange={(value) =>
                            router.get(pagination.path, buildParams({ per_page: value }), {
                                preserveState: true,
                                replace: true,
                            })
                        }
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pagination.per_page.toString()} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[5, 10, 15, 20, 50, 75].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => (pagination.first_page_url ? goToUrl(pagination.first_page_url) : goToPage(1))}
                        disabled={pagination.current_page === 1}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft aria-hidden />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() =>
                            pagination.prev_page_url
                                ? goToUrl(pagination.prev_page_url)
                                : goToPage(Math.max(1, pagination.current_page - 1))
                        }
                        disabled={!pagination.prev_page_url && pagination.current_page === 1}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft aria-hidden />
                    </Button>

                    <div className="flex items-center gap-x-1 px-2">{renderPageLinks()}</div>

                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() =>
                            pagination.next_page_url
                                ? goToUrl(pagination.next_page_url)
                                : goToPage(Math.min(pagination.last_page, pagination.current_page + 1))
                        }
                        disabled={!pagination.next_page_url && pagination.current_page === pagination.last_page}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight aria-hidden />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() =>
                            pagination.last_page_url
                                ? goToUrl(pagination.last_page_url)
                                : goToPage(pagination.last_page)
                        }
                        disabled={pagination.current_page === pagination.last_page}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight aria-hidden />
                    </Button>
                </div>
            </div>
        </div>
    );
}
