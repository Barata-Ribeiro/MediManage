import { DataTable } from '@/components/data-table';
import { doctorColumn } from '@/pages/dashboard/tables/doctor-column';
import { PaginatedUpcomingAppointments } from '@/types/application/appointment';

interface DoctorUpcomingApptTableProps {
    pagination: PaginatedUpcomingAppointments;
}

export default function DoctorUpcomingApptTable({ pagination }: Readonly<DoctorUpcomingApptTableProps>) {
    return <DataTable columns={doctorColumn} data={pagination.data} pagination={pagination} />;
}
