import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Layout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import prescriptions from '@/routes/prescriptions';
import type { BreadcrumbItem, SharedData } from '@/types';
import { Prescription } from '@/types/application/prescription';
import { Head, Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';

interface ShowProps {
    prescription: Prescription;
}

export default function Show({ prescription }: Readonly<ShowProps>) {
    const { auth } = usePage<SharedData>().props;
    if (!auth?.user?.employee_info_id) return dashboard();

    const patient = prescription.patient_info;
    const dateIssued = String(prescription.date_issued).replace(/-/, '/');
    const dateExpires = String(prescription.date_expires).replace(/-/, '/');

    const qrCodeSrc = `data:image/png;base64,${prescription.qr_code}`;

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

    const editLink = prescriptions.edit({
        doctor: auth.user.employee_info_id,
        patientInfo: patient.id!,
        prescription: prescription.id,
    });
    const pdfLink = prescriptions.generatePdf(prescription.id).url;

    const editLabel = `Edit Prescription for ${prescription.patient_info.full_name}`;
    const pdfLabel = `Generate PDF for Prescription of ${prescription.patient_info.full_name}`;

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`Prescription for ${prescription.patient_info.full_name}`} />

            <div className="px-4 py-6">
                <div className="border-b sm:flex sm:items-center sm:justify-between">
                    <Heading
                        title="Prescription Details"
                        description={`Details of the prescription issued to ${prescription.patient_info.full_name}.`}
                    />

                    <div className="mt-3 inline-flex gap-x-2 pb-5 sm:mt-0 sm:ml-4 sm:pb-0">
                        <Button type="button" asChild>
                            <Link href={editLink} aria-label={editLabel} title={editLabel}>
                                Edit
                            </Link>
                        </Button>

                        <Button type="button" variant="secondary" asChild>
                            <a href={pdfLink} aria-label={pdfLabel} title={pdfLabel} target="_blank" rel="external">
                                Generate PDF
                            </a>
                        </Button>
                    </div>
                </div>

                <section
                    aria-label="Prescription Details"
                    className="mx-auto mt-6 flex aspect-[9/16] max-w-7xl flex-col gap-6 rounded-lg border border-t-8 border-border border-t-primary bg-input p-4 dark:bg-muted"
                >
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
                                <span className="block text-right font-semibold">Expires on:</span>{' '}
                                {format(dateExpires, 'PPP')}
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

                    <footer className="mt-auto flex items-end justify-between">
                        <figure className="grid gap-2">
                            <img
                                src={qrCodeSrc}
                                alt="Prescription QR Code"
                                className="rounded-lg border-8 border-primary"
                            />
                            <figcaption className="text-center text-sm font-semibold text-primary">
                                #{prescription.validation_code}
                            </figcaption>
                        </figure>

                        <div className="flex flex-col items-end gap-1">
                            <p className="text-sm">
                                <span className="block text-right font-semibold">Prescribed by:</span>{' '}
                                <span className="block">
                                    {prescription.employee_info.full_name}, {prescription.employee_info.specialization}
                                </span>
                            </p>

                            <p className="text-sm">
                                <span className="block text-right font-semibold">License:</span>{' '}
                                {prescription.employee_info.license_number}
                            </p>
                        </div>
                    </footer>
                </section>
            </div>
        </Layout>
    );
}
