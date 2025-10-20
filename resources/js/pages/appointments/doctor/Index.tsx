import Layout from '@/layouts/app-layout';
import { Appointment } from '@/types/application/appointment';
import { Head } from '@inertiajs/react';

export default function Index({ appointments }: Readonly<{ appointments: Appointment[] }>) {
    return (
        <Layout>
            <Head title="Listing Appointments" />
            <pre>{JSON.stringify(appointments, null, 2)}</pre>
        </Layout>
    );
}
