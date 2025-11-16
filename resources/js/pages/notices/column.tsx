import { DataTableColumnHeader } from '@/components/data-table-column-header';
import DropdownMenuCopyButton from '@/components/ui-helpers/dropdown-menu-copy-button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { normalizeString } from '@/lib/utils';
import notices from '@/routes/notices';
import { TableNotice } from '@/types/application/notice';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns/format';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

export const column: ColumnDef<TableNotice>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        enableSorting: true,
    },
    {
        accessorKey: 'title',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'type',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
        cell: ({ row }) => normalizeString(row.original.type),
        enableSorting: true,
    },
    {
        accessorKey: 'is_active',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Is Active" />,
        cell: ({ row }) => (
            <Badge variant={row.original.is_active ? 'default' : 'destructive'} className="select-none">
                {row.original.is_active ? 'Active' : 'Inactive'}
            </Badge>
        ),
        enableSorting: true,
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
        cell: ({ row }) => {
            function Actions() {
                const [isDialogOpen, setIsDialogOpen] = useState(false);

                return (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <DropdownMenuCopyButton content={row.original.title}>
                                        Copy Title
                                    </DropdownMenuCopyButton>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Show</DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={notices.edit(row.original.id)} className="w-full" as="button">
                                        Edit
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => setIsDialogOpen(true)} variant="destructive">
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the notice{' '}
                                        <strong>{row.original.title}</strong> from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel asChild>
                                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} autoFocus>
                                            Cancel
                                        </Button>
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        asChild
                                        className="bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40"
                                    >
                                        <Link href={notices.destroy(row.original.id)} as="button">
                                            Yes, delete notice
                                        </Link>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </>
                );
            }

            return <Actions />;
        },
    },
];
