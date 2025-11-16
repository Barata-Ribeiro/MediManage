import AppPageAlert from '@/components/application/app-page-alert';
import EditPatientPrescriptionForm from '@/components/forms/prescriptions/edit-patient-prescription-form';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import Layout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import prescriptions from '@/routes/prescriptions';
import type { BreadcrumbItem, SharedData } from '@/types';
import { Prescription } from '@/types/application/prescription';
import { Head, usePage } from '@inertiajs/react';
import { format } from 'date-fns';

interface EditProps {
    prescription: Prescription;
}

export default function Edit({ prescription }: Readonly<EditProps>) {
    const { auth } = usePage<SharedData>().props;
    if (!auth?.user?.employee_info_id) return dashboard();

    const patient = prescription.patient_info;
    const dateIssued = String(prescription.date_issued).replaceAll('-', '/');
    const dateExpires = String(prescription.date_expires).replaceAll('-', '/');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Prescriptions',
            href: prescriptions.index(auth.user.employee_info_id).url,
        },
        {
            title: 'Prescription Details',
            href: prescriptions.show({
                doctor: auth.user.employee_info_id,
                patientInfo: patient.id!,
                prescription: prescription.id,
            }).url,
        },
        {
            title: 'Prescription Edit',
            href: prescriptions.edit({
                doctor: auth.user.employee_info_id,
                patientInfo: patient.id!,
                prescription: prescription.id,
            }).url,
        },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Prescription for ${prescription.patient_info.full_name}`} />

            <div className="px-4 py-6">
                <Heading
                    title="Edit Prescription"
                    description={`Modify details for ${patient.full_name}'s prescription.`}
                />

                <section className="mx-auto mt-6 flex max-w-7xl flex-col gap-6 rounded-lg border border-t-8 border-border border-t-primary bg-input p-4 dark:bg-muted">
                    <header>
                        <h3 className="scroll-m-20 text-center text-4xl font-bold tracking-tight text-balance">
                            {prescription.patient_info.full_name}
                        </h3>
                        <div className="my-2 flex h-5 justify-center space-x-2 text-center text-sm font-semibold text-muted-foreground">
                            <span>{patient.gender}</span>
                            <Separator orientation="vertical" />
                            <span>{patient.age} years old</span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            <time className="text-sm">
                                <span className="block text-left font-semibold">Issued on:</span>{' '}
                                {format(dateIssued, 'PPP')}
                            </time>
                            <time className="text-sm">
                                <span className="block text-right font-semibold">Current Expiration:</span>{' '}
                                {format(dateExpires, 'PPP')}
                            </time>
                        </div>
                    </header>

                    <AppPageAlert
                        title="Sensitive Information"
                        message="Prescriptions are incredibly sensitive documents. Handle with care - verify everything
                            before editing or sharing any details."
                        variant="warning"
                    />

                    <EditPatientPrescriptionForm data={prescription} />
                </section>
            </div>
        </Layout>
    );
}
