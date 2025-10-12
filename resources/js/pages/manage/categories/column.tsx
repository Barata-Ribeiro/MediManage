import { DataTableColumnHeader } from '@/components/data-table-column-header';
import DropdownMenuCopyButton from '@/components/ui-helpers/dropdown-menu-copy-button';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import categories, { destroy } from '@/routes/categories';
import { Category } from '@/types/application/article';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import type { MouseEvent } from 'react';

function handleDelete(e: MouseEvent<HTMLDivElement>, original: Category) {
    e.preventDefault();
    if (confirm(`Are you sure you want to delete the category: "${original.name}"? This action cannot be undone.`)) {
        return router.delete(destroy(original.id));
    }
}

export const column: ColumnDef<Category>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        enableSorting: true,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        enableSorting: true,
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => <p className="truncate">{row.original.description ?? '-'}</p>,
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
        cell: ({ row }) => format(row.original.created_at, 'PPpp'),
        enableSorting: true,
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
        cell: ({ row }) => format(row.original.updated_at, 'PPpp'),
        enableSorting: true,
    },

    {
        id: 'actions',
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <DropdownMenuCopyButton content={row.original.name}>Copy Name</DropdownMenuCopyButton>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href={categories.edit(row.original.id)} className="w-full" as="button">
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={(e) => handleDelete(e, row.original)}>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];
