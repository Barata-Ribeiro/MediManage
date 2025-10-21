import Heading from '@/components/heading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useInitials } from '@/hooks/use-initials';
import Layout from '@/layouts/app-layout';
import { cn, normalizeString } from '@/lib/utils';
import doctor from '@/routes/appointments/doctor';
import { SharedData } from '@/types';
import { AppointmentWithRelations } from '@/types/application/appointment';
import { Head, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarClockIcon } from 'lucide-react';
import { Fragment, useState } from 'react';

export default function Index({ appointments }: Readonly<{ appointments: AppointmentWithRelations[] }>) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();

    const urlParams = globalThis?.window?.location?.search
        ? new URLSearchParams(globalThis.window.location.search)
        : null;

    const monthParam = urlParams?.get('month');
    const yearParam = urlParams?.get('year');
    const dayParam = urlParams?.get('day');

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

    const initialDate = (() => {
        const now = new Date();

        if (yearParam && monthParam) {
            const y = Number.parseInt(yearParam, 10);
            const m = Math.max(0, Math.min(11, Number.parseInt(monthParam, 10) - 1));
            let d = now.getDate();

            if (dayParam) {
                const parsedDay = Number.parseInt(dayParam, 10);
                if (!Number.isNaN(parsedDay) && parsedDay >= 1 && parsedDay <= 31) d = parsedDay;
            }

            return new Date(y, m, d);
        }
        return now;
    })();

    const [date, setDate] = useState<Date | undefined>(initialDate);

    const appointmentsOnCurrentDate = appointments.filter((appointment) => {
        if (!date) return false;
        const appt = new Date(appointment.appointment_date);
        return (
            appt.getDate() === date.getDate() &&
            appt.getMonth() === date.getMonth() &&
            appt.getFullYear() === date.getFullYear()
        );
    });

    const appointmentDates = Array.from({ length: appointments.length }, (_, i) => {
        return new Date(appointments[i].appointment_date);
    });

    function handleDateChange(selectedDate: Date) {
        setDate(selectedDate);

        const selectedMonth = selectedDate.getMonth();
        const selectedYear = selectedDate.getFullYear();

        if (selectedMonth !== date?.getMonth() || selectedYear !== date?.getFullYear()) {
            const doctorId = auth.user.employee_info_id;
            if (!doctorId) return;

            const month = selectedMonth + 1; // Months are zero-based
            const year = selectedYear;
            const day = selectedDate.getDate();

            router.get(doctor.index(doctorId, { mergeQuery: { month, year, day } }).url);
        }
    }

    return (
        <Layout>
            <Head title="Listing Appointments" />

            <div className="px-4 py-6">
                <Heading
                    title="My Appointments"
                    description="An interactive calendar to visualize all your patient's appointments."
                />

                <Card>
                    <CardContent className="lg:grid lg:grid-cols-12 lg:gap-x-16">
                        <div className="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(selectedDate) => selectedDate && handleDateChange(selectedDate)}
                                defaultMonth={date}
                                showOutsideDays={false}
                                modifiers={{ apts: appointmentDates }}
                                modifiersClassNames={{
                                    apts: cn(
                                        'after:absolute after:top-1 after:right-1 after:block after:size-2.5 after:rounded-full after:bg-red-600 after:content-[""]',
                                    ),
                                }}
                                formatters={{
                                    formatWeekdayName: (date) => {
                                        return date.toLocaleString('en-US', { weekday: 'short' });
                                    },
                                }}
                                className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
                            />
                        </div>

                        <ol className="mt-4 divide-y divide-muted text-sm/6 lg:col-span-7 xl:col-span-8 dark:divide-muted-foreground">
                            {workingHours.map((hour) => {
                                const appointmentAtThisHour = appointmentsOnCurrentDate.find((appointment) => {
                                    const appointmentDate = new Date(appointment.appointment_date);
                                    return format(appointmentDate, 'HH:mm') === hour;
                                });

                                const patientName = appointmentAtThisHour?.patient_info.full_name!;
                                const patientAvatar = appointmentAtThisHour?.patient_info.user?.avatar;

                                return (
                                    <li key={hour} className="relative flex items-center gap-x-6 py-6 xl:static">
                                        <div className="flex items-center gap-x-4">
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
                                                    <p className="text-sm text-muted-foreground italic">
                                                        No appointment
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="ml-auto inline-flex items-center gap-x-2">
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
                    </CardContent>

                    <CardFooter className="border-t pt-6">
                        <p className="text-sm text-muted-foreground">
                            {appointmentsOnCurrentDate.length} appointment
                            {appointmentsOnCurrentDate.length === 1 ? '' : 's'} on {date ? format(date, 'PPP') : null}
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </Layout>
    );
}
