import AppPageAlert from '@/components/app-page-alert';
import PatientEditForm from '@/components/forms/patients/patient-edit-form';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import Layout from '@/layouts/app-layout';
import patient_info, { update } from '@/routes/patient_info';
import { BreadcrumbItem } from '@/types';
import { PatientInfo } from '@/types/application/patient';
import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';

interface EditProps {
    patient: PatientInfo;
}

export default function Edit({ patient }: Readonly<EditProps>) {
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(new Date(patient.date_of_birth));

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Patient Details',
            href: patient_info.show(patient.id).url,
        },
        {
            title: 'Edit Patient',
            href: patient_info.edit(patient.id).url,
        },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Patient: ${patient.full_name}`} />

            <div className="px-4 py-6">
                <Heading title="Edit Patient" description="Update the information for the patient." />

                <section className="rounded-md bg-card p-4 shadow sm:p-6">
                    <AppPageAlert
                        title="Edit Patient"
                        message="You are editing the patient record. Please ensure that all information is accurate by reviewing the details before saving."
                        variant="info"
                    />

                    <Form
                        {...update.form(patient.id)}
                        options={{ preserveScroll: true }}
                        className="space-y-6 inert:pointer-events-none inert:opacity-50"
                        disableWhileProcessing
                        transform={(data) => ({
                            ...data,
                            date_of_birth: dateOfBirth?.toISOString().split('T')[0] ?? null,
                        })}
                    >
                        {({ errors }) => (
                            <>
                                <PatientEditForm
                                    errors={errors}
                                    date={dateOfBirth}
                                    onChange={setDateOfBirth}
                                    patient={patient}
                                />

                                <Button type="submit" className="w-full">
                                    Update Patient
                                </Button>
                            </>
                        )}
                    </Form>
                </section>
            </div>
        </Layout>
    );
}
