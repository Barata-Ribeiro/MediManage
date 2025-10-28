import CreateAppointmentForm from '@/components/forms/appointments/create-appointment-form';
import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import appointments from '@/routes/appointments';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

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
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Schedule Appointment" />

            <div className="px-4 py-6">
                <Heading
                    title="Schedule Appointment"
                    description="Fill out the form to schedule a new appointment. Select a date and time, then select the patient and a doctor."
                />

                <section className="rounded-md bg-card p-4 shadow sm:p-6">
                    <CreateAppointmentForm occupiedSlots={occupiedSlots} />
                </section>
            </div>
        </Layout>
    );
}
