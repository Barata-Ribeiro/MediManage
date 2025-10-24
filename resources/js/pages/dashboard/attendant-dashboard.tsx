import HeadingSmall from '@/components/heading-small';
import DashboardHeader from '@/components/helpers/dashboard-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { normalizeString } from '@/lib/utils';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { PaginatedUpcomingAppointments } from '@/types/application/appointment';
import { EmployeeInfo } from '@/types/application/employee';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns/format';
import { CalendarClockIcon, CalendarPlusIcon } from 'lucide-react';
import { Fragment } from 'react/jsx-runtime';

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
    const getInitials = useInitials();
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

                        {/* TODO: Implement new appointment functionality */}
                        <Button variant="secondary" disabled>
                            <CalendarPlusIcon aria-hidden size={16} /> Schedule
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
                                <li
                                    key={hour}
                                    className="relative flex items-center gap-x-6 py-4 first:pt-0 last:pb-0 xl:static"
                                >
                                    <div className="flex items-center gap-x-4">
                                        {/* AVATAR */}
                                        <Avatar className="size-8">
                                            {appointmentAtThisHour ? (
                                                <Fragment>
                                                    <AvatarImage src={patientAvatar} alt={patientName} />
                                                    <AvatarFallback>{getInitials(patientName)}</AvatarFallback>
                                                </Fragment>
                                            ) : (
                                                <AvatarFallback />
                                            )}
                                        </Avatar>

                                        {/* APPOINTMENT DETAILS */}
                                        <div className="min-w-0">
                                            {appointmentAtThisHour ? (
                                                <Fragment>
                                                    <div className="inline-flex items-center gap-x-1">
                                                        <p className="truncate font-medium">
                                                            {appointmentAtThisHour.patient_info?.full_name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            ({appointmentAtThisHour.patient_info.age} yrs)
                                                        </p>
                                                    </div>

                                                    <div className="divide flex flex-wrap items-center gap-1 divide-muted sm:divide-x dark:divide-muted-foreground">
                                                        <time
                                                            dateTime={new Date(
                                                                appointmentAtThisHour.appointment_date,
                                                            ).toISOString()}
                                                            className="inline-flex items-center gap-x-1 pr-1 text-sm text-muted-foreground"
                                                        >
                                                            <CalendarClockIcon size={16} aria-hidden />

                                                            {format(appointmentAtThisHour.appointment_date, 'PPP')}
                                                        </time>
                                                        <p className="text-sm text-muted-foreground">
                                                            {appointmentAtThisHour.reason_for_visit}
                                                        </p>
                                                    </div>
                                                </Fragment>
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic">No appointment</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* APPOINTMENT STATUS AND TIME */}
                                    <div className="ml-auto inline-flex items-center gap-x-2">
                                        {/* TODO: Replace with component to change status */}
                                        {appointmentAtThisHour && (
                                            <Badge
                                                variant={
                                                    ['canceled', 'missed'].includes(appointmentAtThisHour.status)
                                                        ? 'destructive'
                                                        : 'default'
                                                }
                                            >
                                                {normalizeString(appointmentAtThisHour.status)}
                                            </Badge>
                                        )}
                                        <div className="text-sm text-muted-foreground">{hour}</div>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>
        </AppLayout>
    );
}
