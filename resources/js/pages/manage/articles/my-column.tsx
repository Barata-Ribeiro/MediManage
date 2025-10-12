import articleController from '@/actions/App/Http/Controllers/Article/ArticleController';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import TextLink from '@/components/text-link';
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
import { article } from '@/routes';
import { destroy } from '@/routes/articles';
import { TableArticle } from '@/types/application/article';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import type { MouseEvent } from 'react';

function handleDelete(e: MouseEvent<HTMLDivElement>, original: TableArticle) {
    e.preventDefault();
    if (confirm(`Are you sure you want to delete the article: "${original.title}"? This action cannot be undone.`)) {
        return router.delete(destroy(original.slug));
    }
}

export const myColumn: ColumnDef<TableArticle>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        enableSorting: true,
    },
    {
        accessorKey: 'title',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
        cell: ({ row }) =>
            row.original.is_published ? (
                <TextLink
                    href={article(row.original.slug)}
                    target="_blank"
                    rel="external"
                    aria-label={`View article: ${row.original.title}`}
                >
                    {row.original.title}
                </TextLink>
            ) : (
                row.original.title
            ),
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'is_published',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Published" />,
        cell: ({ row }) => (row.original.is_published ? 'Yes' : 'No'),
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
            const title = row.original.title;

            return (
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
                            <DropdownMenuCopyButton content={title}>Copy Title</DropdownMenuCopyButton>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            {row.original.is_published && (
                                <DropdownMenuItem asChild>
                                    <Link
                                        className="w-full"
                                        href={article(row.original.slug)}
                                        target="_blank"
                                        rel="external"
                                        aria-label={`View article: ${row.original.title}`}
                                        as="button"
                                    >
                                        View
                                    </Link>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                className="w-full"
                                href={articleController.edit(row.original.slug)}
                                aria-label={`Edit article: ${row.original.title}`}
                                as="button"
                            >
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={(e) => handleDelete(e, row.original)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
