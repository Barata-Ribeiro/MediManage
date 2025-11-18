import { Badge } from '@/components/ui/badge';
import { normalizeString } from '@/lib/utils';
import { UpcomingAppointment } from '@/types/application/appointment';
import { ColumnDef } from '@tanstack/react-table';

export const patientColumn: ColumnDef<UpcomingAppointment>[] = [
    {
        accessorKey: 'id',
        enableSorting: false,
        enableHiding: false,
        size: 40,
    },
    {
        accessorKey: 'date',
        header: 'Date',
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'time',
        header: 'Time',
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'doctor',
        header: 'Doctor',
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status;
            const isCanceledOrMissed = status === 'canceled' || status === 'missed';
            return <Badge variant={isCanceledOrMissed ? 'destructive' : 'default'}>{normalizeString(status)}</Badge>;
        },
        enableSorting: false,
        enableHiding: false,
    },
];
