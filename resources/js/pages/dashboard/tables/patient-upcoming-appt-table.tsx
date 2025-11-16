import { DataTable } from '@/components/table/data-table';
import { patientColumn } from '@/pages/dashboard/tables/patient-column';
import { PaginatedUpcomingAppointments } from '@/types/application/appointment';

interface PatientUpcomingApptTableProps {
    pagination: PaginatedUpcomingAppointments;
}

export default function PatientUpcomingApptTable({ pagination }: Readonly<PatientUpcomingApptTableProps>) {
    return <DataTable columns={patientColumn} data={pagination.data} pagination={pagination} />;
}
