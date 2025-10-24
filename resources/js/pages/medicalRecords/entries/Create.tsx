import medicalRecordController from '@/actions/App/Http/Controllers/Medical/MedicalRecordController';
import NewEntryMedicalRecordForm from '@/components/forms/medicalRecords/new-entry-medical-record-form';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import Layout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Appointment } from '@/types/application/appointment';
import { MedicalRecord } from '@/types/application/medicalRecord';
import { PatientInfo } from '@/types/application/patient';
import { Head, Link } from '@inertiajs/react';
import { CalendarX2Icon, CircleChevronLeftIcon } from 'lucide-react';

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

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`Add Entry to Medical Record #${medicalRecord.id}`} />

            <div className="px-4 py-6">
                <Heading
                    title={`Add Entry to Medical Record #${medicalRecord.id}`}
                    description="You can add a new entry to this medical record below. You'll have access up to five valid appointments to select from."
                />

                <section className="rounded-md bg-card p-4 shadow sm:p-6">
                    {appointments.length > 0 ? (
                        <NewEntryMedicalRecordForm medicalRecordId={medicalRecord.id} appointments={appointments} />
                    ) : (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <CalendarX2Icon aria-hidden />
                                </EmptyMedia>
                                <EmptyTitle>No Valid Appointments Available</EmptyTitle>
                                <EmptyDescription>
                                    There are no valid appointments associated with this patient to create a medical
                                    record entry. Please ensure the patient has had at least one appointment before
                                    adding an entry.
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={medicalRecordController.show(medicalRecord.id)} prefetch="hover">
                                        <CircleChevronLeftIcon aria-hidden />
                                        Go Back
                                    </Link>
                                </Button>
                            </EmptyContent>
                        </Empty>
                    )}
                </section>
            </div>
        </Layout>
    );
}
