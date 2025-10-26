import UpdateAppointmentStatusForm from '@/components/forms/appointments/update-appointment-status-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { UpcomingAppointment } from '@/types/application/appointment';
import { format } from 'date-fns';
import { CalendarClockIcon } from 'lucide-react';
import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';

interface DashboardAppointmentListItemProps {
    hour: string;
    appointmentAtThisHour: UpcomingAppointment | undefined;
    patientAvatar: string | undefined;
    patientName: string;
}

export default function DashboardAppointmentListItem({
    hour,
    appointmentAtThisHour,
    patientAvatar,
    patientName,
}: Readonly<DashboardAppointmentListItemProps>) {
    const getInitials = useInitials();
    const [currentAppointment, setCurrentAppointment] = useState<UpcomingAppointment | undefined>(
        appointmentAtThisHour,
    );

    return (
        <li key={hour} className="relative flex items-center gap-x-6 py-4 first:pt-0 last:pb-0 xl:static">
            <div className="flex items-center gap-x-4">
                {/* AVATAR */}
                <Avatar className="size-8">
                    {currentAppointment ? (
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
                    {currentAppointment ? (
                        <Fragment>
                            <div className="inline-flex items-center gap-x-1">
                                <p className="truncate font-medium">{currentAppointment.patient_info?.full_name}</p>
                                <p className="text-sm text-muted-foreground">
                                    ({currentAppointment.patient_info.age} yrs)
                                </p>
                            </div>

                            <div className="divide flex flex-wrap items-center gap-1 divide-muted sm:divide-x dark:divide-muted-foreground">
                                <time
                                    dateTime={new Date(currentAppointment.appointment_date).toISOString()}
                                    className="inline-flex items-center gap-x-1 pr-1 text-sm text-muted-foreground"
                                >
                                    <CalendarClockIcon size={16} aria-hidden />

                                    {format(currentAppointment.appointment_date, 'PPP')}
                                </time>
                                <p className="text-sm text-muted-foreground">{currentAppointment.reason_for_visit}</p>
                            </div>
                        </Fragment>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No appointment</p>
                    )}
                </div>
            </div>

            {/* APPOINTMENT STATUS AND TIME */}
            <div className="ml-auto inline-flex items-center gap-x-2">
                {currentAppointment && (
                    <UpdateAppointmentStatusForm
                        appointment={currentAppointment}
                        setAppointment={setCurrentAppointment}
                    />
                )}

                <div className="text-sm text-muted-foreground">{hour}</div>
            </div>
        </li>
    );
}
