import medicalRecordController from '@/actions/App/Http/Controllers/Medical/MedicalRecordController';
import NewEntryMedicalRecordForm from '@/components/forms/medicalRecords/new-entry-medical-record-form';
import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Appointment } from '@/types/application/appointment';
import { MedicalRecord } from '@/types/application/medicalRecord';
import { PatientInfo } from '@/types/application/patient';
import { Head } from '@inertiajs/react';

interface CreateProps {
    medicalRecord: Pick<MedicalRecord, 'id' | 'patient_info_id'> & {
        patient_info: Pick<PatientInfo, 'id' | 'first_name' | 'last_name' | 'date_of_birth'>;
    };
    appointments: Appointment[];
}

export default function Create({ medicalRecord, appointments }: Readonly<CreateProps>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Medical Records',
            href: medicalRecordController.index().url,
        },
        {
            title: `View Record #${medicalRecord.id}`,
            href: medicalRecordController.show(medicalRecord.id).url,
        },
        {
            title: 'Add Entry',
            href: medicalRecordController.createEntry(medicalRecord.id).url,
        },
    ];

    console.log({ medicalRecord, appointments });

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`Add Entry to Medical Record #${medicalRecord.id}`} />

            <div className="px-4 py-6">
                <Heading
                    title={`Add Entry to Medical Record #${medicalRecord.id}`}
                    description="You can add a new entry to this medical record below. You'll have access up to five valid appointments to select from."
                />

                <section className="rounded-md bg-card p-4 shadow sm:p-6">
                    <NewEntryMedicalRecordForm medicalRecordId={medicalRecord.id} appointments={appointments} />
                </section>
            </div>
        </Layout>
    );
}
