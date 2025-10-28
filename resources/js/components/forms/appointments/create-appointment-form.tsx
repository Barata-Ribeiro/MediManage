import CalendarSkeleton from '@/components/blocks/skeletons/calendar-skeleton';
import AppointmentCalendarPicker from '@/components/helpers/appointment-calendar-picker';
import DoctorSelectCombobox from '@/components/helpers/doctor-select-combobox';
import PatientSelectCombobox from '@/components/helpers/patient-select-combobox';
import InputError from '@/components/input-error';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import appointments from '@/routes/appointments';
import { Deferred, Form } from '@inertiajs/react';
import { useState } from 'react';

export default function CreateAppointmentForm({ occupiedSlots }: Readonly<{ occupiedSlots: Date[] }>) {
    const [finalDate, setFinalDate] = useState<string | undefined>(undefined);
    const [patientId, setPatientId] = useState<string | null>(null);
    const [doctorId, setDoctorId] = useState<string | null>(null);

    return (
        <Form
            {...appointments.store.form()}
            options={{ preserveScroll: true }}
            className="space-y-6 inert:pointer-events-none inert:opacity-50"
            transform={(data) => ({
                ...data,
                appointment_date: finalDate,
                patient_info_id: patientId,
                employee_info_id: doctorId,
            })}
            disableWhileProcessing
        >
            {({ errors }) => (
                <>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <PatientSelectCombobox setPatientId={setPatientId} error={errors.patient_info_id} size="full" />
                        <DoctorSelectCombobox setDoctorId={setDoctorId} error={errors.doctor_info_id} size="full" />
                    </div>

                    <Field>
                        <FieldLabel htmlFor="reason_for_visit">Reason for Visit</FieldLabel>
                        <Input
                            type="text"
                            id="reason_for_visit"
                            name="reason_for_visit"
                            maxLength={500}
                            placeholder="e.g. Regular Checkup"
                            aria-invalid={!!errors.reason_for_visit}
                            required
                            aria-required
                        />

                        <InputError message={errors.reason_for_visit} className="mt-2" />
                    </Field>

                    <div className="*:mx-auto">
                        <Deferred data="occupiedSlots" fallback={<CalendarSkeleton />}>
                            <AppointmentCalendarPicker occupiedSlots={occupiedSlots} setFinalDate={setFinalDate} />
                        </Deferred>

                        <InputError message={errors.appointment_date} className="mt-2 text-center" />
                    </div>
                </>
            )}
        </Form>
    );
}
