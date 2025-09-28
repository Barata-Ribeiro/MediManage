import medicalRecordController from '@/actions/App/Http/Controllers/Medical/MedicalRecordController';
import NewMedicalRecordForm from '@/components/forms/medicalRecords/new-medical-record-form';
import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Medical Records',
        href: medicalRecordController.index().url,
    },
    {
        title: 'Create',
        href: medicalRecordController.create().url,
    },
];

export default function Create() {
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Write Medical Record" />

            <div className="px-4 py-6">
                <Heading title="New Medical Record" description="Write a new medical record for a patient." />

                <section className="container py-4 sm:py-6">
                    <NewMedicalRecordForm />
                </section>
            </div>
        </Layout>
    );
}
