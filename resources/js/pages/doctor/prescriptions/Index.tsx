import doctorPrescriptionController from '@/actions/App/Http/Controllers/Medical/Prescription/DoctorPrescriptionController';
import Heading from '@/components/heading';
import { DataTable } from '@/components/table/data-table';
import Layout from '@/layouts/app-layout';
import { column } from '@/pages/doctor/prescriptions/column';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, SharedData } from '@/types';
import { PaginationPrescriptions } from '@/types/application/prescription';
import { Head, usePage } from '@inertiajs/react';

export default function Index({ prescriptions }: Readonly<{ prescriptions: PaginationPrescriptions }>) {
    const { auth } = usePage<SharedData>().props;
    if (!auth?.user?.employee_info_id) return dashboard();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Prescriptions',
            href: doctorPrescriptionController.index(auth.user.employee_info_id).url,
        },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Listing Prescriptions" />

            <div className="px-4 py-6">
                <Heading title="Prescriptions" description="Listing all prescriptions issued by you." />

                <section aria-label="Prescriptions Table">
                    <DataTable columns={column} data={prescriptions.data} pagination={prescriptions} />
                </section>
            </div>
        </Layout>
    );
}
