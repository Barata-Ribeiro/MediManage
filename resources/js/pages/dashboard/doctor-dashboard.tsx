import AppointmentsGenderOverviewChart from '@/components/charts/appointments-gender-overview-chart';
import AppointmentsStatusOverviewChart from '@/components/charts/appointments-status-overview-chart';
import NewPatientsByMonthChart from '@/components/charts/new-patients-by-month-chart';
import DashboardHeader from '@/components/helpers/dashboard-header';
import AppLayout from '@/layouts/app-layout';
import DoctorUpcomingApptTable from '@/pages/dashboard/tables/doctor-upcoming-appt-table';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, ChartItem } from '@/types';
import { PaginatedUpcomingAppointments } from '@/types/application/appointment';
import { EmployeeInfo } from '@/types/application/employee';
import { Head } from '@inertiajs/react';

interface DoctorDashboardProps {
    data: {
        doctorInfo: EmployeeInfo;
        appointmentsGenderOverview: ChartItem;
        appointmentsStatusOverview: ChartItem;
        weeklyAppointmentsTrend: ChartItem;
        newPatientsByMonth: ChartItem;
        upcomingToday: PaginatedUpcomingAppointments;
        distinctPatientsLast30Days: number;
        newPatientsThisMonth: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function DoctorDashboard({ data }: Readonly<DoctorDashboardProps>) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Doctor Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DashboardHeader
                    avatar={data.doctorInfo.user?.avatar}
                    fullName={data.doctorInfo.full_name}
                    email={data.doctorInfo.user?.email}
                    phoneNumber={data.doctorInfo.phone_number}
                    dateOfBirth={data.doctorInfo.date_of_birth}
                    age={data.doctorInfo.age}
                />

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <NewPatientsByMonthChart chartData={data.newPatientsByMonth} />

                    <AppointmentsGenderOverviewChart chartData={data.appointmentsGenderOverview} />

                    <AppointmentsStatusOverviewChart chartData={data.appointmentsStatusOverview} />
                </div>
                <div className="flex-1">
                    <DoctorUpcomingApptTable pagination={data.upcomingToday} />
                </div>
            </div>
        </AppLayout>
    );
}
