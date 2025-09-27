import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import { column } from '@/pages/doctor/prescriptions/column';
import { PaginationPrescriptions } from '@/types/application/prescription';
import { Head } from '@inertiajs/react';

export default function Index({ prescriptions }: Readonly<{ prescriptions: PaginationPrescriptions }>) {
    return (
        <Layout>
            <Head title="Index" />

            <div className="px-4 py-6">
                <Heading title="Prescriptions" description="Listing all prescriptions issued by you." />

                <section aria-label="">
                    <DataTable columns={column} data={prescriptions.data} pagination={prescriptions} />
                </section>
            </div>
        </Layout>
    );
}
