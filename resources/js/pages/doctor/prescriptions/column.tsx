import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Prescription } from '@/types/application/prescription';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export const column: ColumnDef<Prescription>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        enableSorting: true,
    },
    {
        id: 'patient_info.first_name',
        accessorKey: 'patient_info.first_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="First Name" />,
        enableSorting: true,
        enableHiding: false,
    },
    {
        id: 'patient_info.last_name',
        accessorKey: 'patient_info.last_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Last Name" />,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'date_issued',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Issued At" />,
        cell: ({ row }) => format(row.original.date_issued, 'PPpp'),
        enableSorting: true,
    },
    {
        accessorKey: 'date_expires',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Expires At" />,
        cell: ({ row }) => format(row.original.date_expires, 'PPpp'),
        enableSorting: true,
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
        cell: ({ row }) => format(row.original.updated_at, 'PPpp'),
        enableSorting: true,
    },
];
