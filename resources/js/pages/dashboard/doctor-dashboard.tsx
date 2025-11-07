import AppointmentsGenderOverviewChart from '@/components/charts/appointments-gender-overview-chart';
import AppointmentsStatusOverviewChart from '@/components/charts/appointments-status-overview-chart';
import NewPatientsByMonthChart from '@/components/charts/new-patients-by-month-chart';
import HeadingSmall from '@/components/heading-small';
import DashboardAppointmentListItem from '@/components/helpers/dashboard-appointment-list-item';
import DashboardHeader from '@/components/helpers/dashboard-header';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, ChartItem } from '@/types';
import { PaginatedUpcomingAppointments } from '@/types/application/appointment';
import { EmployeeInfoWithRelations } from '@/types/application/employee';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';

interface DoctorDashboardProps {
    data: {
        doctorInfo: EmployeeInfoWithRelations;
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
    const { upcomingToday } = data;

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
                    <HeadingSmall
                        title="Today's Upcoming Appointments"
                        description="List of all upcoming appointments for today."
                    />

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
