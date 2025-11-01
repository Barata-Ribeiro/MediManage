import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import { myPrescriptions } from '@/routes/prescriptions';
import type { BreadcrumbItem } from '@/types';
import { PaginationPrescriptions } from '@/types/application/prescription';
import { Head } from '@inertiajs/react';
import { patientColumn } from './column';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Prescriptions',
        href: myPrescriptions().url,
    },
];

export default function Index({ prescriptions }: Readonly<{ prescriptions: PaginationPrescriptions }>) {
    console.log(prescriptions);

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Listing Your Prescriptions" />

            <div className="px-4 py-6">
                <Heading title="Prescriptions" description="Listing all prescriptions issued to you." />

                <section aria-label="Prescriptions Table">
                    <DataTable columns={patientColumn} data={prescriptions.data} pagination={prescriptions} />
                </section>
            </div>
        </Layout>
    );
}
