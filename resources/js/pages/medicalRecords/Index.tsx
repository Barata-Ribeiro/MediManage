import medicalRecordController from '@/actions/App/Http/Controllers/Medical/MedicalRecordController';
import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import Layout from '@/layouts/app-layout';
import { column } from '@/pages/medicalRecords/column';
import type { BreadcrumbItem } from '@/types';
import { PaginationMedicalRecord } from '@/types/application/medicalRecord';
import { Head, Link } from '@inertiajs/react';
import { NotebookPenIcon } from 'lucide-react';

export default function Index({ medicalRecords }: Readonly<{ medicalRecords: PaginationMedicalRecord }>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Medical Records',
            href: medicalRecordController.index().url,
        },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Medical Records" />

            <div className="px-4 py-6">
                <div className="flex items-center justify-between">
                    <Heading title="Medical Records" description="Listing all medical records." />

                    <Button variant="secondary" asChild>
                        <Link href={medicalRecordController.create()} prefetch>
                            <NotebookPenIcon aria-hidden /> Initiate Record
                        </Link>
                    </Button>
                </div>

                <section aria-label="Medical Records Table">
                    <DataTable columns={column} data={medicalRecords.data} pagination={medicalRecords} />
                </section>
            </div>
        </Layout>
    );
}
