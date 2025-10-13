import medicalRecordController from '@/actions/App/Http/Controllers/Medical/MedicalRecordController';
import AppPageAlert from '@/components/app-page-alert';
import EditMedicalRecordForm from '@/components/forms/medicalRecords/edit-medical-record-form';
import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { MedicalRecord } from '@/types/application/medicalRecord';
import { Head } from '@inertiajs/react';

export default function Edit({ medicalRecord }: Readonly<{ medicalRecord: MedicalRecord }>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Medical Records',
            href: medicalRecordController.index().url,
        },
        {
            title: 'Edit',
            href: medicalRecordController.edit(medicalRecord.id).url,
        },
    ];

    const patientFullName = medicalRecord.patient_info.full_name;

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`Medical Record — ${patientFullName ?? 'Edit'}`} />

            <div className="px-4 py-6">
                <Heading title="Edit Medical Record" description={`Medical Record of ${patientFullName}`} />

                <section className="rounded-md bg-card p-4 shadow sm:p-6">
                    <AppPageAlert
                        title="Sensitive Information"
                        message="Medical records contain confidential patient information. Handle with care — verify
                            permissions before viewing, editing, or sharing."
                        variant="warning"
                    />

                    <EditMedicalRecordForm
                        id={medicalRecord.id}
                        html={medicalRecord.medical_notes_html}
                        json={medicalRecord.medical_notes_json}
                    />
                </section>
            </div>
        </Layout>
    );
}
