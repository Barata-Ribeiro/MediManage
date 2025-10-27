import CalendarSkeleton from '@/components/blocks/skeletons/calendar-skeleton';
import Heading from '@/components/heading';
import AppointmentCalendarPicker from '@/components/helpers/appointment-calendar-picker';
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
                        className="inert:pointer-events-none inert:opacity-50"
                        transform={(data) => ({
                            ...data,
                            appointment_date: finalDate,
                        })}
                        disableWhileProcessing
                    >
                        {({ errors }) => (
                            <>
                                {/* TODO: Complete the appointment creation form */}
                                <Deferred data="occupiedSlots" fallback={<CalendarSkeleton />}>
                                    <AppointmentCalendarPicker
                                        occupiedSlots={occupiedSlots}
                                        setFinalDate={setFinalDate}
                                    />
                                </Deferred>

                                <pre>{JSON.stringify(finalDate, null, 2)}</pre>
                            </>
                        )}
                    </Form>
                </section>
            </div>
        </Layout>
    );
}
