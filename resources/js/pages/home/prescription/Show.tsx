import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Item, ItemContent, ItemHeader } from '@/components/ui/item';
import Layout from '@/layouts/app/app-public-layout';
import { cn } from '@/lib/utils';
import { Prescription } from '@/types/application/prescription';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';

interface ShowProps {
    prescription: Partial<Prescription>;
}

export default function Show({ prescription }: Readonly<ShowProps>) {
    const dateIssued = new Date(prescription.date_issued ?? '').toLocaleDateString();
    const dateExpires = new Date(prescription.date_expires ?? '').toLocaleDateString();

    const isValid = prescription.is_valid;
    const validLabel = isValid ? 'Valid' : 'Expired';
    const validationClass = cn(
        isValid ? 'bg-secondary text-secondary-foreground' : 'bg-destructive text-destructive-foreground',
        'mx-auto w-full rounded-lg p-6 text-center text-3xl font-medium select-none sm:text-4xl md:text-5xl',
    );

    return (
        <Layout>
            <Head title={`Validation Prescription #${prescription.validation_code}`} />

            <section className="container py-26 md:py-36">
                <Heading title="Prescription Details" description="Detailed information about the prescription." />

                <Item variant="muted" className="grid gap-6">
                    <h1 className="text-center text-2xl leading-tight font-bold tracking-tight sm:text-3xl md:text-4xl">
                        Prescription Details - #{prescription.id}
                    </h1>

                    <span aria-live="polite" role="status" title={validLabel} className={validationClass}>
                        {validLabel}
                    </span>

                    <ItemHeader className="mx-auto grid text-center">
                        <p>
                            <strong>Validation Code:</strong> {prescription.validation_code}
                        </p>
                        <p>
                            <strong>Date Issued:</strong> <time dateTime={dateIssued}>{format(dateIssued, 'PPP')}</time>
                        </p>
                        <p>
                            <strong>Date Expires:</strong>{' '}
                            <time dateTime={dateExpires}>{format(dateExpires, 'PPP')}</time>
                        </p>
                    </ItemHeader>

                    <ItemContent className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Doctor Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p>
                                        <strong>Name:</strong> {prescription.employee_info?.full_name}
                                    </p>
                                    <p>
                                        <strong>Specialization:</strong> {prescription.employee_info?.specialization}
                                    </p>
                                    <p>
                                        <strong>License Number:</strong> {prescription.employee_info?.license_number}
                                    </p>
                                    <p>
                                        <strong>Phone Number:</strong> {prescription.employee_info?.phone_number}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Patient Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p>
                                        <strong>Name:</strong> {prescription.patient_info?.full_name}
                                    </p>
                                    <p>
                                        <strong>Age:</strong> {prescription.patient_info?.age}
                                    </p>
                                    <p>
                                        <strong>Gender:</strong> {prescription.patient_info?.gender}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </ItemContent>
                </Item>
            </section>
        </Layout>
    );
}
