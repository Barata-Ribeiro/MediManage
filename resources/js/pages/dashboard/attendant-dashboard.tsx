import HeadingSmall from '@/components/heading-small';
import DashboardAppointmentListItem from '@/components/helpers/dashboard-appointment-list-item';
import DashboardHeader from '@/components/helpers/dashboard-header';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { create } from '@/routes/appointments';
import { BreadcrumbItem } from '@/types';
import { PaginatedUpcomingAppointments } from '@/types/application/appointment';
import { EmployeeInfo } from '@/types/application/employee';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns/format';
import { CalendarPlusIcon } from 'lucide-react';

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

    const workingHours = [
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
    ] as const;

    const appointments = upcomingToday.data;

    const appointmentsOnCurrentDate = appointments.filter((appointment) => {
        const date = new Date();
        const appt = new Date(appointment.appointment_date);
        return (
            appt.getDate() === date.getDate() &&
            appt.getMonth() === date.getMonth() &&
            appt.getFullYear() === date.getFullYear()
        );
    });

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
                    <div className="flex items-center justify-between gap-4">
                        <HeadingSmall
                            title="Today's Upcoming Appointments"
                            description="List of all upcoming appointments for today."
                        />

                        <Button variant="secondary" asChild>
                            <Link href={create()} prefetch>
                                <CalendarPlusIcon aria-hidden size={16} /> Schedule
                            </Link>
                        </Button>
                    </div>

                    <ol className="mt-4 divide-y divide-muted rounded-lg border border-border p-4 text-sm/6 lg:col-span-7 xl:col-span-8 dark:divide-muted-foreground">
                        {workingHours.map((hour) => {
                            const appointmentAtThisHour = appointmentsOnCurrentDate.find((appointment) => {
                                const appointmentDate = new Date(appointment.appointment_date);
                                return format(appointmentDate, 'HH:mm') === hour;
                            });

                            const patientName = appointmentAtThisHour?.patient_info?.full_name ?? '';
                            const patientAvatar = appointmentAtThisHour?.patient_info?.user?.avatar ?? undefined;

                            return (
                                <DashboardAppointmentListItem
                                    key={hour}
                                    hour={hour}
                                    appointmentAtThisHour={appointmentAtThisHour}
                                    patientAvatar={patientAvatar}
                                    patientName={patientName}
                                />
                            );
                        })}
                    </ol>
                </div>
            </div>
        </AppLayout>
    );
}
