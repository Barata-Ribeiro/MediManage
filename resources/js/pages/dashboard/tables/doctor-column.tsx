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
        accessorKey: 'status',
        header: 'Status',
        enableSorting: false,
        enableHiding: false,
    },
];
