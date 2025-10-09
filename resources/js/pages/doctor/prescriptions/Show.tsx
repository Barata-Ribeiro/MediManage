import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import Layout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import prescriptions from '@/routes/prescriptions';
import type { BreadcrumbItem, SharedData } from '@/types';
import { Prescription } from '@/types/application/prescription';
import { Head, usePage } from '@inertiajs/react';
import { format } from 'date-fns';

interface ShowProps {
    prescription: Prescription;
}

export default function Show({ prescription }: Readonly<ShowProps>) {
    const { auth } = usePage<SharedData>().props;
    if (!auth?.user?.employee_info_id) return dashboard();

    console.log(prescription);

    const patient = prescription.patient_info;
    const patientFullName = `${patient.first_name} ${patient.last_name}`;

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
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`Prescription for ${patientFullName}`} />

            <div className="px-4 py-6">
                <Heading
                    title="Prescription Details"
                    description={`Details of the prescription issued to ${patientFullName}.`}
                />

                <section
                    aria-label="Prescription Details"
                    className="mx-auto mt-6 grid max-w-7xl gap-6 rounded-lg border border-t-8 border-border border-t-primary bg-input p-4 dark:bg-muted"
                >
                    <header>
                        <h3 className="scroll-m-20 text-center text-4xl font-bold tracking-tight text-balance">
                            {patientFullName}
                        </h3>
                        <p className="my-2 flex h-5 justify-center space-x-2 text-center text-sm font-semibold text-muted-foreground">
                            <span>{patient.gender}</span>
                            <Separator orientation="vertical" />
                            <span>{patient.age} years old</span>
                        </p>

                        <div className="flex items-center justify-between gap-2">
                            <time className="text-sm">
                                <span className="block text-left font-semibold">Issued on:</span>{' '}
                                {format(prescription.date_issued, 'PPP')}
                            </time>
                            <time className="text-sm">
                                <span className="block text-right font-semibold">Expires on:</span>{' '}
                                {format(prescription.date_expires, 'PPP')}
                            </time>
                        </div>
                    </header>

                    <article className="space-y-4" aria-labelledby="prescription-details-title">
                        <h4
                            id="prescription-details-title"
                            className="inline-block scroll-m-20 rounded-md bg-primary px-2 py-0.5 text-base font-semibold tracking-tight text-primary-foreground md:text-lg"
                        >
                            Prescription Details
                        </h4>
                        <div
                            className="prose prose-base lg:prose-xl dark:prose-invert"
                            dangerouslySetInnerHTML={{
                                __html: prescription.prescription_details_html ?? '<p>No details provided.</p>',
                            }}
                        />
                    </article>

                    <footer className="flex flex-col items-end gap-1">
                        <p className="text-sm">
                            <span className="block text-right font-semibold">Prescribed by:</span>{' '}
                            {prescription.employee_info.full_name}
                        </p>
                        <p className="text-sm">{prescription.employee_info.specialization}</p>
                    </footer>
                </section>
            </div>
        </Layout>
    );
}
