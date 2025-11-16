import AppPageAlert from '@/components/application/app-page-alert';
import PartialNewPatientForm from '@/components/forms/patients/partial-new-patient-form';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import Layout from '@/layouts/app-layout';
import { createPartial, storePartial } from '@/routes/patient_info';
import type { BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'New Partial',
        href: createPartial().url,
    },
];

export default function CreatePartial() {
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="New Patient" />

            <div className="px-4 py-6">
                <Heading
                    title="New Patient"
                    description="Fill out the form to create a new patient without an user account."
                />

                <section className="rounded-md bg-card p-4 shadow sm:p-6">
                    <AppPageAlert
                        title="Partial Patient"
                        message="You are creating a partial patient record. This record will not have an associated user account and only the staff can access it."
                        variant="info"
                    />

                    <Form
                        {...storePartial.form()}
                        options={{ preserveScroll: true }}
                        className="space-y-6 inert:pointer-events-none inert:opacity-50"
                        disableWhileProcessing
                        transform={(data) => ({
                            ...data,
                            date_of_birth: dateOfBirth?.toISOString().split('T')[0] ?? null,
                        })}
                    >
                        {({ errors, resetAndClearErrors }) => (
                            <>
                                <PartialNewPatientForm errors={errors} date={dateOfBirth} onChange={setDateOfBirth} />

                                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Button type="submit" className="w-full">
                                        Create Patient
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                            resetAndClearErrors();
                                            setDateOfBirth(null);
                                        }}
                                    >
                                        Clear Form
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </section>
            </div>
        </Layout>
    );
}
