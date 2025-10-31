import AppPageAlert from '@/components/app-page-alert';
import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import { column } from '@/pages/appointments/patient/column';
import { dashboard } from '@/routes';
import { index } from '@/routes/appointments/patient';
import { BreadcrumbItem, SharedData } from '@/types';
import { PaginatedTableAppointments } from '@/types/application/appointment';
import { Head, usePage } from '@inertiajs/react';

interface IndexProps {
    appointments: PaginatedTableAppointments;
}

export default function Index({ appointments }: Readonly<IndexProps>) {
    const { auth } = usePage<SharedData>().props;
    if (!auth?.user?.patient_info_id) return dashboard();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'My Appointments',
            href: index(auth.user.patient_info_id).url,
        },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Your appointments" />

            <div className="px-4 py-6">
                <Heading title="My Appointments" description="Manage your appointments here." />

                <AppPageAlert
                    title="Important!"
                    message="For any changes or cancellations to your appointments, please contact the clinic directly via phone or email."
                    variant="warning"
                />

                <section aria-label="Appointments Table">
                    <DataTable columns={column} data={appointments.data} pagination={appointments} />
                </section>
            </div>
        </Layout>
    );
}
