import { DataTablePagination } from '@/components/table/data-table-pagination';
import { DataTableViewOptions } from '@/components/table/data-table-view-options';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { buildParams } from '@/lib/utils';
import { PaginationMeta } from '@/types';
import { Link, router } from '@inertiajs/react';
import {
    Column,
    ColumnDef,
    flexRender,
    getCoreRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { TrashIcon } from 'lucide-react';
import { Activity, useEffect, useRef, useState } from 'react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: PaginationMeta<TData[]>['data'];
    pagination: PaginationMeta<TData[]>;
}

function getCommonPinningStyles<TData>({
    column,
    withBorder = false,
}: {
    column: Column<TData>;
    withBorder?: boolean;
}): React.CSSProperties {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

    const leftPinnedBoxShadow = '-4px 0 4px -4px var(--border) inset';
    const rightPinnedBoxShadow = '4px 0 4px -4px var(--border) inset';

    const rightPinnedShadow = isFirstRightPinnedColumn ? rightPinnedBoxShadow : undefined;
    const pinnedColumnShadow = isLastLeftPinnedColumn ? leftPinnedBoxShadow : rightPinnedShadow;

    return {
        boxShadow: withBorder ? pinnedColumnShadow : undefined,
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        opacity: isPinned ? 0.97 : 1,
        position: isPinned ? 'sticky' : 'relative',
        background: 'var(--background)',
        width: column.getSize(),
        zIndex: isPinned ? 1 : undefined,
    };
}

export function DataTable<TData, TValue>({ columns, data, pagination }: Readonly<DataTableProps<TData, TValue>>) {
    const [sorting, setSorting] = useState<SortingState>(() => {
        const params = new URLSearchParams(globalThis.location.search);
        const sort_by = params.get('sort_by');
        const sort_dir = params.get('sort_dir');
        if (!sort_by) return [];

        return [{ id: sort_by, desc: sort_dir === 'desc' }];
    });

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const getInitialSearch = () => {
        const params = new URLSearchParams(globalThis.location.search);
        return params.get('search') ?? '';
    };

    const [search, setSearch] = useState<string>(getInitialSearch());
    const [path] = useState<string | undefined>(pagination.path);
    const searchDebounce = useRef<NodeJS.Timeout | undefined>(undefined);

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true, // turn off client-side pagination
        manualSorting: true, // turn off client-side sorting
        pageCount: pagination.last_page ?? Math.ceil((pagination.total ?? 0) / (pagination.per_page ?? 1)),
        initialState: {
            pagination: {
                pageIndex: Math.max((pagination.current_page ?? 1) - 1, 0),
                pageSize: pagination.per_page,
            },
            columnPinning: { left: ['id'], right: ['actions'] },
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        state: { sorting, columnVisibility },
    });

    // Sync sorting state with server via Inertia
    useEffect(() => {
        if (!path) return;

        const params = new URLSearchParams(globalThis.location.search);
        const currentSortBy = params.get('sort_by');
        const currentSortDir = params.get('sort_dir');

        const sort = sorting?.[0];
        const desiredSortBy = sort ? String(sort.id) : undefined;
        let desiredSortDir: string | undefined = undefined;

        if (sort) desiredSortDir = sort.desc ? 'desc' : 'asc';

        if (currentSortBy === desiredSortBy && currentSortDir === desiredSortDir) return;

        router.get(path, buildParams({ sort_by: desiredSortBy, sort_dir: desiredSortDir }), {
            preserveState: true,
            replace: true,
        });
    }, [sorting, path]);

    useEffect(() => {
        if (!path) return;

        globalThis.clearTimeout(searchDebounce.current);
        const params = new URLSearchParams(globalThis.location.search);
        const currentSearch = params.get('search') ?? '';

        if (currentSearch === (search ?? '')) return;

        globalThis.clearTimeout(searchDebounce.current);
        searchDebounce.current = globalThis.setTimeout(() => {
            router.get(path, buildParams({ search: search ?? undefined }), {
                preserveState: true,
                replace: true,
            });
        }, 400);

        return () => globalThis.clearTimeout(searchDebounce.current);
    }, [search, path]);

    return (
        <div className="mx-auto w-full flex-col space-y-4">
            <div className="flex items-center py-4">
                <Activity
                    mode={
                        pagination.total > 10 || new URLSearchParams(globalThis.location.search).toString() !== ''
                            ? 'visible'
                            : 'hidden'
                    }
                >
                    <div className="inline-flex w-full flex-1 items-center gap-x-2">
                        <Input
                            type="search"
                            placeholder="Search..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="max-w-sm"
                        />
                        <Button variant="outline" size="icon" aria-label="Clear Filters" title="Clear Filters" asChild>
                            <Link href={pagination.path} prefetch>
                                <TrashIcon aria-hidden size={16} />
                            </Link>
                        </Button>
                    </div>
                </Activity>

                <DataTableViewOptions table={table} />
            </div>

            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            style={{
                                                ...getCommonPinningStyles({ column: header.column }),
                                            }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            style={{
                                                ...getCommonPinningStyles({ column: cell.column }),
                                            }}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Activity mode={pagination.total > 10 ? 'visible' : 'hidden'}>
                <DataTablePagination pagination={pagination} />
            </Activity>
        </div>
    );
}
