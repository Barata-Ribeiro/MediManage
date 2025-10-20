import medicalRecordController from '@/actions/App/Http/Controllers/Medical/MedicalRecordController';
import EditMedicalRecordEntryForm from '@/components/forms/medicalRecords/edit-medical-record-entry-form';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import { Badge } from '@/components/ui/badge';
import Layout from '@/layouts/app-layout';
import { normalizeString } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { MedicalRecord, MedicalRecordEntryWithRelations } from '@/types/application/medicalRecord';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';

interface EditProps {
    medicalRecord: Pick<MedicalRecord, 'id' | 'patient_info_id' | 'patient_info'>;
    medicalRecordEntry: MedicalRecordEntryWithRelations;
}

export default function Edit({ medicalRecord, medicalRecordEntry }: Readonly<EditProps>) {
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
            title: `Edit Entry #${medicalRecordEntry.id}`,
            href: medicalRecordController.editEntry({
                medicalRecord: medicalRecord.id,
                medicalRecordEntry: medicalRecordEntry.id,
            }).url,
        },
    ];

    const appointmentInfo = medicalRecordEntry.appointment!;
    const appointmentDate = String(appointmentInfo.appointment_date).replaceAll('-', '/');

    const patientFullName = medicalRecord.patient_info.full_name;
    const patientDateOfBirth = String(medicalRecord.patient_info.date_of_birth).replaceAll('-', '/');

    const doctorFullName = medicalRecordEntry.employee_info?.full_name;
    const doctorDateOfBirth = String(medicalRecordEntry.employee_info?.date_of_birth).replaceAll('-', '/');

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Medical Record Entry — ${medicalRecordEntry.title ?? 'Edit'}`} />

            <div className="px-4 py-6">
                <Heading title="Edit Medical Record Entry" description={`Editing Entry #${medicalRecordEntry.id}`} />

                <section aria-label="appointment information" className="rounded-md bg-card p-4 shadow sm:p-6">
                    <HeadingSmall
                        title="Appointment Information"
                        description="Details of the appointment associated with this entry"
                    />

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <dl className="grid gap-2">
                            <div>
                                <dt className="text-xs text-muted-foreground">ID</dt>
                                <dd className="mt-1">{appointmentInfo?.id}</dd>
                            </div>

                            <div>
                                <dt className="text-xs text-muted-foreground">Appointment Date</dt>
                                <dd className="mt-1">{format(appointmentDate, 'PPpp')}</dd>
                            </div>
                        </dl>

                        <dl className="grid gap-2">
                            <div>
                                <dt className="text-xs text-muted-foreground">Status</dt>
                                <dd className="mt-1">
                                    <Badge>{normalizeString(appointmentInfo.status)}</Badge>
                                </dd>
                            </div>

                            <div className="sm:col-span-2">
                                <dt className="text-xs text-muted-foreground">Reason for Visit</dt>
                                <dd className="mt-1">{appointmentInfo?.reason_for_visit}</dd>
                            </div>
                        </dl>
                    </div>
                </section>

                <section aria-label="entry patient information" className="mt-6 rounded-md bg-card p-4 shadow sm:p-6">
                    <HeadingSmall
                        title="Entry Patient Information"
                        description="Details of the patient associated with this entry"
                    />

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <dl className="grid gap-2">
                            <div>
                                <dt className="text-xs text-muted-foreground">ID</dt>
                                <dd className="mt-1">{medicalRecord.patient_info_id}</dd>
                            </div>

                            <div>
                                <dt className="text-xs text-muted-foreground">Full Name</dt>
                                <dd className="mt-1">{patientFullName}</dd>
                            </div>
                        </dl>

                        <dl className="grid gap-2">
                            <div>
                                <dt className="text-xs text-muted-foreground">Date of Birth</dt>
                                <dd className="mt-1">
                                    {format(patientDateOfBirth, 'PPP')} ({medicalRecord.patient_info.age} years old)
                                </dd>
                            </div>

                            <div className="sm:col-span-2">
                                <dt className="text-xs text-muted-foreground">Gender</dt>
                                <dd className="mt-1">{medicalRecord.patient_info.gender}</dd>
                            </div>
                        </dl>
                    </div>
                </section>

                <section aria-label="entry doctor information" className="mt-6 rounded-md bg-card p-4 shadow sm:p-6">
                    <HeadingSmall
                        title="Entry Doctor Information"
                        description="Details of the doctor associated with this entry"
                    />

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <dl className="grid gap-2">
                            <div>
                                <dt className="text-xs text-muted-foreground">ID</dt>
                                <dd className="mt-1">{medicalRecordEntry.employee_info_id}</dd>
                            </div>

                            <div>
                                <dt className="text-xs text-muted-foreground">Full Name</dt>
                                <dd className="mt-1">{doctorFullName}</dd>
                            </div>
                        </dl>

                        <dl className="grid gap-2">
                            <div>
                                <dt className="text-xs text-muted-foreground">Date of Birth</dt>
                                <dd className="mt-1">
                                    {format(doctorDateOfBirth, 'PPP')} ({medicalRecordEntry.employee_info?.age} years
                                    old)
                                </dd>
                            </div>

                            <div className="sm:col-span-2">
                                <dt className="text-xs text-muted-foreground">Gender</dt>
                                <dd className="mt-1">{medicalRecordEntry.employee_info?.gender}</dd>
                            </div>
                        </dl>
                    </div>
                </section>

                <section aria-label="entry edit form" className="mt-6 rounded-md bg-card p-4 shadow sm:p-6">
                    <HeadingSmall title="Edit Entry" description="Modify the details of this medical record entry" />

                    <EditMedicalRecordEntryForm medicalRecordEntry={medicalRecordEntry} />
                </section>
            </div>
        </Layout>
    );
}
