import HeadingSmall from '@/components/heading-small';
import DashboardHeader from '@/components/helpers/dashboard-header';
import AppLayout from '@/layouts/app-layout';
import DoctorUpcomingApptTable from '@/pages/dashboard/tables/doctor-upcoming-appt-table';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { PaginatedUpcomingAppointments } from '@/types/application/appointment';
import { EmployeeInfo } from '@/types/application/employee';
import { Head } from '@inertiajs/react';

interface AttendantDashboardProps {
    data: {
        attendantInfo: EmployeeInfo;
        upcomingToday: PaginatedUpcomingAppointments;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function AttendantDashboard({ data }: Readonly<AttendantDashboardProps>) {
    const { attendantInfo, upcomingToday } = data;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendant Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DashboardHeader
                    avatar={attendantInfo.user?.avatar}
                    fullName={attendantInfo.full_name}
                    email={attendantInfo.user?.email}
                    phoneNumber={attendantInfo.phone_number}
                    dateOfBirth={attendantInfo.date_of_birth}
                    age={attendantInfo.age}
                />

                <div className="flex-1">
                    <HeadingSmall
                        title="Today's Upcoming Appointments"
                        description="List of all upcoming appointments for today."
                    />
                    <DoctorUpcomingApptTable pagination={upcomingToday} />
                </div>
            </div>
        </AppLayout>
    );
}
