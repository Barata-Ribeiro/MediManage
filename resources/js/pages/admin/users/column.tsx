import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Role } from '@/types/admin/roles';
import { User } from '@/types/admin/users';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

// TODO: Add actions column with view, edit and delete buttons
export const columns: ColumnDef<User>[] = [
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
        accessorKey: 'email',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
        enableSorting: true,
    },
    {
        accessorKey: 'role',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
        cell: ({ row }) => {
            const roles = (row.original.roles as Role[]) ?? [];
            return roles.map((role: Role) => role.name).join(', ');
        },
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
];
