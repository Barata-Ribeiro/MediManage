import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { normalizeString } from '@/lib/utils';
import appointments from '@/routes/appointments';
import { UpcomingAppointment } from '@/types/application/appointment';
import { AppointmentStatus } from '@/types/application/enums';
import { FormComponentSlotProps } from '@inertiajs/core';
import { Form } from '@inertiajs/react';
import { useEchoModel } from '@laravel/echo-react';
import { format } from 'date-fns';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface UpdateAppointmentStatusFormProps {
    appointment: UpcomingAppointment;
    setAppointment: Dispatch<SetStateAction<UpcomingAppointment | undefined>>;
}

export default function UpdateAppointmentStatusForm({
    appointment,
    setAppointment,
}: Readonly<UpdateAppointmentStatusFormProps>) {
    const formRef = useRef<FormComponentSlotProps | null>(null);
    const localChangeRef = useRef(false);
    const [status, setStatus] = useState<AppointmentStatus>(appointment.status);

    useEchoModel('App.Models.Appointment', appointment.id, ['AppointmentUpdated'], (e) => {
        const updatedAppointment = e as unknown as UpcomingAppointment;
        setAppointment(updatedAppointment);

        const hour = format(updatedAppointment.appointment_date, 'HH:mm aa');
        const patientName = updatedAppointment.patient_info.full_name;

        toast.info(`Appointment status for ${patientName} at ${hour} has been updated.`, {
            duration: Infinity,
        });
    });

    useEffect(() => {
        if (localChangeRef.current && status !== appointment.status && formRef.current) {
            formRef.current.submit();
            localChangeRef.current = false;
        }
    }, [status]);

    useEffect(() => setStatus(appointment.status), [appointment.status]);

    function handleStatusChange(value: string) {
        localChangeRef.current = true;
        setStatus(value as AppointmentStatus);
    }

    return (
        <Form
            ref={formRef}
            {...appointments.update.status.form.patch(appointment.id)}
            options={{ preserveScroll: true }}
            disableWhileProcessing
            className="inert:pointer-events-none inert:opacity-50"
        >
            {({ errors }) => {
                return (
                    <Select name="status" value={status} onValueChange={handleStatusChange}>
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
