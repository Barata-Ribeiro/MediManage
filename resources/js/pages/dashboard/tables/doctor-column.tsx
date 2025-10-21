import { Badge } from '@/components/ui/badge';
import { normalizeString } from '@/lib/utils';
import { UpcomingAppointment } from '@/types/application/appointment';
import { ColumnDef } from '@tanstack/react-table';

export const doctorColumn: ColumnDef<UpcomingAppointment>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        enableSorting: false,
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
        accessorKey: 'patient',
        header: 'Patient',
        enableSorting: false,
        enableHiding: false,
    },
    {
        // TODO: Implement status update functionality
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
