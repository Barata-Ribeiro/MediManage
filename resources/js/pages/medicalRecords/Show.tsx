import medicalRecordController from '@/actions/App/Http/Controllers/Medical/MedicalRecordController';
import Layout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { MedicalRecord, MedicalRecordEntry } from '@/types/application/medicalRecord';
import { Head } from '@inertiajs/react';

interface ShowProps {
    medicalRecord: MedicalRecord;
    entries: MedicalRecordEntry[];
}

export default function Show({ medicalRecord, entries }: Readonly<ShowProps>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Medical Records',
            href: medicalRecordController.index().url,
        },
        {
            title: 'Show',
            href: medicalRecordController.show(medicalRecord.id).url,
        },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`Medical Record — ${medicalRecord?.id ?? 'Show'}`} />

            <div dangerouslySetInnerHTML={{ __html: medicalRecord.medical_notes_html }} />

            <pre>{JSON.stringify({ entries }, null, 2)}</pre>
        </Layout>
    );
}
