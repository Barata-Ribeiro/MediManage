import { DataTablePagination } from '@/components/data-table-pagination';
import { DataTableViewOptions } from '@/components/data-table-view-options';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { buildParams } from '@/lib/utils';
import { PaginationMeta } from '@/types';
import { Link, router } from '@inertiajs/react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { TrashIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: PaginationMeta<TData[]>['data'];
    pagination: PaginationMeta<TData[]>;
}

export function DataTable<TData, TValue>({ columns, data, pagination }: Readonly<DataTableProps<TData, TValue>>) {
    const getInitialSorting = (): SortingState => {
        const params = new URLSearchParams(window.location.search);
        const sort_by = params.get('sort_by');
        const sort_dir = params.get('sort_dir');
        if (!sort_by) return [];

        return [{ id: sort_by, desc: sort_dir === 'desc' }];
    };

    const [sorting, setSorting] = useState<SortingState>(getInitialSorting);

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const getInitialSearch = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('search') ?? '';
    };

    const [search, setSearch] = useState<string>(getInitialSearch());
    const searchDebounce = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!pagination.path) return;

        if (!sorting || sorting.length === 0) {
            router.get(pagination.path, buildParams({ sort_by: undefined, sort_dir: undefined }), {
                preserveState: true,
                replace: true,
            });
            return;
        }

        const sort = sorting[0];
        const sortBy = String(sort.id);
        const sortDir = sort.desc ? 'desc' : 'asc';

        if (sortBy) {
            router.get(pagination.path, buildParams({ sort_by: sortBy, sort_dir: sortDir }), {
                preserveState: true,
                replace: true,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sorting]);

    useEffect(() => {
        if (!pagination.path) return;

        window.clearTimeout(searchDebounce.current);
        searchDebounce.current = window.setTimeout(() => {
            router.get(pagination.path, buildParams({ search: search ?? undefined }), {
                preserveState: true,
                replace: true,
            });
        }, 400);

        return () => window.clearTimeout(searchDebounce.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnVisibility,
        },
    });

    return (
        <div className="mx-auto w-full flex-col space-y-4">
            <div className="flex items-center py-4">
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

                <DataTableViewOptions table={table} />
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
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
                                        <TableCell key={cell.id}>
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

            <DataTablePagination pagination={pagination} />
        </div>
    );
}
