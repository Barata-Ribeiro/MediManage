import { DataTableColumnHeader } from '@/components/data-table-column-header';
import TextLink from '@/components/text-link';
import { article } from '@/routes';
import { TableArticle } from '@/types/application/article';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export const column: ColumnDef<TableArticle>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        enableSorting: true,
    },
    {
        accessorKey: 'title',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
        cell: ({ row }) => (
            <TextLink href={article(row.original.slug)} target="_blank" rel="external">
                {row.original.title}
            </TextLink>
        ),
        enableSorting: true,
        enableHiding: false,
    },
    {
        id: 'user.name',
        accessorKey: 'user.name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Author" />,
        enableSorting: true,
        enableHiding: false,
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
    // TODO: Implement action column for edit/delete actions
];
