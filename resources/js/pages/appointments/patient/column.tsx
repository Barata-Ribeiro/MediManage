import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { normalizeString } from '@/lib/utils';
import { TableAppointment } from '@/types/application/appointment';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns/format';

export const column: ColumnDef<TableAppointment>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        enableSorting: true,
    },
    {
        accessorKey: 'reason_for_visit',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Reason for Visit" />,
        enableSorting: false,
    },
    {
        accessorKey: 'employee_info.first_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Doctor" />,
        cell: ({ row }) => row.original.employee_info.full_name,
        enableSorting: true,
    },

    {
        accessorKey: 'employee_info.specialization',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Doctor Specialization" />,
        enableSorting: true,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.original.status;
            const sanitizedStatus = normalizeString(status);

            const badgeVariant = ['canceled', 'missed'].includes(status) ? 'destructive' : 'default';

            return <Badge variant={badgeVariant}>{sanitizedStatus}</Badge>;
        },
        enableSorting: true,
    },
    {
        accessorKey: 'appointment_date',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Appointment Date" />,
        cell: ({ row }) => format(row.original.appointment_date, 'PPpp'),
        enableSorting: true,
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated" />,
        cell: ({ row }) => format(row.original.updated_at, 'PPpp'),
        enableSorting: true,
    },
];
