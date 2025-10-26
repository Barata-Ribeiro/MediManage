import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { normalizeString } from '@/lib/utils';
import appointments from '@/routes/appointments';
import { UpcomingAppointment } from '@/types/application/appointment';
import { AppointmentStatus } from '@/types/application/enums';
import { Form } from '@inertiajs/react';
import { useEchoModel } from '@laravel/echo-react';
import { Dispatch, SetStateAction } from 'react';

interface UpdateAppointmentStatusFormProps {
    appointment: UpcomingAppointment;
    setAppointment: Dispatch<SetStateAction<UpcomingAppointment | undefined>>;
}

export default function UpdateAppointmentStatusForm({
    appointment,
    setAppointment,
}: Readonly<UpdateAppointmentStatusFormProps>) {
    useEchoModel<UpcomingAppointment, 'App.Models.Appointment'>(
        'App.Models.Appointment',
        appointment.id,
        ['.AppointmentUpdated'],
        (e) => setAppointment(e.model),
    );

    return (
        <Form
            {...appointments.update.status.form.patch(appointment.id)}
            options={{ preserveScroll: true }}
            disableWhileProcessing
            className="inert:pointer-events-none inert:opacity-50"
        >
            {({ errors }) => {
                return (
                    <Select name="status" defaultValue={appointment.status}>
                        <SelectTrigger aria-invalid={!!errors.status} onChange={(e) => e.currentTarget.form?.submit()}>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {Object.values(AppointmentStatus).map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {normalizeString(status)}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                );
            }}
        </Form>
    );
}
