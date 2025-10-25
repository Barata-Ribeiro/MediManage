import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useInitials } from '@/hooks/use-initials';
import { normalizeString } from '@/lib/utils';
import appointments from '@/routes/appointments';
import { UpcomingAppointment } from '@/types/application/appointment';
import { AppointmentStatus } from '@/types/application/enums';
import { Form } from '@inertiajs/react';
import { useEchoModel } from '@laravel/echo-react';
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

    /**
     * Subscribes to real-time updates for a specific appointment and applies updates to local state.
     *
     * Uses the useEchoModel hook to listen for the '.AppointmentUpdated' event on the
     * 'App.Models.Appointment' channel for the provided appointment id. When an update is
     * received, the hook's callback calls setCurrentAppointment with the updated model.
     *
     * This component is side-effect only: it sets up the subscription and returns null (renders nothing).
     *
     * @param props.id - The appointment identifier to subscribe to. Can be a string or a number.
     *
     * @remarks
     * - Requires the surrounding scope to provide a setCurrentAppointment function (used in the callback).
     * - Intended to be mounted inside a component that manages appointment state.
     * - Subscription lifecycle (subscribe/unsubscribe) is managed by the underlying useEchoModel hook.
     *
     * @returns null
     */
    function AppointmentEchoSubscriber({ id }: { id: string | number }) {
        useEchoModel<UpcomingAppointment, 'App.Models.Appointment'>(
            'App.Models.Appointment',
            id,
            ['.AppointmentUpdated'],
            (e) => setCurrentAppointment(e.model),
        );

        return null;
    }

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
                {/**
                 *  status control placeholder
                 * @TODO: Remove placeholder and implement efficient status update UI
                 */}
                {appointmentAtThisHour?.id && <AppointmentEchoSubscriber id={appointmentAtThisHour.id} />}
                {currentAppointment && (
                    <Badge
                        variant={['canceled', 'missed'].includes(currentAppointment.status) ? 'destructive' : 'default'}
                    >
                        {normalizeString(currentAppointment.status)}
                    </Badge>
                )}

                {/**
                 * Quick status changer: a compact select that patches the appointment status
                 * @TODO: improve styling to better fit dashboard design
                 */}
                {currentAppointment && (
                    <Form {...appointments.update.status.form.patch(currentAppointment.id)} className="ml-2">
                        <select
                            name="status"
                            defaultValue={currentAppointment.status}
                            onChange={(e) => e.currentTarget.form?.submit()}
                            aria-label="Change appointment status"
                            className="rounded border px-2 py-1 text-sm"
                        >
                            {Object.values(AppointmentStatus).map((status) => (
                                <option key={status} value={status}>
                                    {normalizeString(status)}
                                </option>
                            ))}
                        </select>
                    </Form>
                )}
                <div className="text-sm text-muted-foreground">{hour}</div>
            </div>
        </li>
    );
}
