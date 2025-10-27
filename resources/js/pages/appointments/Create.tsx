import CalendarSkeleton from '@/components/blocks/skeletons/calendar-skeleton';
import Heading from '@/components/heading';
import AppointmentCalendarPicker from '@/components/helpers/appointment-calendar-picker';
import PatientSelectCombobox from '@/components/helpers/patient-select-combobox';
import Layout from '@/layouts/app-layout';
import appointments from '@/routes/appointments';
import { BreadcrumbItem } from '@/types';
import { Deferred, Form, Head } from '@inertiajs/react';
import { useState } from 'react';

interface CreateProps {
    occupiedSlots: Date[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Schedule Appointment',
        href: appointments.create().url,
    },
];

export default function Create({ occupiedSlots }: Readonly<CreateProps>) {
    const [finalDate, setFinalDate] = useState<string | undefined>(undefined);
    const [patientId, setPatientId] = useState<string | null>(null);

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Schedule Appointment" />

            <div className="px-4 py-6">
                <Heading
                    title="Schedule Appointment"
                    description="Fill out the form to schedule a new appointment. Select a date and time, then select the patient and a doctor."
                />

                <section className="rounded-md bg-card p-4 shadow sm:p-6">
                    <Form
                        {...appointments.store.form()}
                        options={{ preserveScroll: true }}
                        className="space-y-6 inert:pointer-events-none inert:opacity-50"
                        transform={(data) => ({
                            ...data,
                            appointment_date: finalDate,
                            patient_info_id: patientId,
                        })}
                        disableWhileProcessing
                    >
                        {({ errors }) => (
                            <>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <PatientSelectCombobox
                                        setPatientId={setPatientId}
                                        error={errors.patient_info_id}
                                        size="full"
                                    />
                                    {/* TODO: Implement doctor select here */}
                                </div>

                                <div className="*:mx-auto">
                                    <Deferred data="occupiedSlots" fallback={<CalendarSkeleton />}>
                                        <AppointmentCalendarPicker
                                            occupiedSlots={occupiedSlots}
                                            setFinalDate={setFinalDate}
                                        />
                                    </Deferred>
                                </div>

                                <pre>{JSON.stringify(finalDate, null, 2)}</pre>
                            </>
                        )}
                    </Form>
                </section>
            </div>
        </Layout>
    );
}
