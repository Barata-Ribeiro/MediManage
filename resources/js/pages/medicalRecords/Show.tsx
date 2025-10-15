import medicalRecordController from '@/actions/App/Http/Controllers/Medical/MedicalRecordController';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent } from '@/components/ui/item';
import Layout from '@/layouts/app-layout';
import patient_info from '@/routes/patient_info';
import type { BreadcrumbItem } from '@/types';
import { MedicalRecord, MedicalRecordEntry } from '@/types/application/medicalRecord';
import { Deferred, Head, Link } from '@inertiajs/react';

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
    console.log(medicalRecord);

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`Medical Record #${medicalRecord?.id ?? 'Show'}`} />

            <div className="container max-w-7xl px-6 py-4">
                <Heading
                    title="Medical Record"
                    description={`These are the medical notes for this record. Record ID: ${medicalRecord.id}`}
                />

                <article className="space-y-2 [&>header]:space-y-4">
                    <header>
                        <Item variant="muted">
                            <ItemContent>
                                <dl className="flex flex-col justify-evenly gap-8 sm:flex-row">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Patient
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            {medicalRecord.patient_info.first_name}{' '}
                                            {medicalRecord.patient_info.last_name} (ID: {medicalRecord.patient_info.id})
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Date of Birth
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(medicalRecord.patient_info.date_of_birth).toLocaleDateString()}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</dt>
                                        <dd className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            {medicalRecord.patient_info.gender}
                                        </dd>
                                    </div>
                                </dl>
                            </ItemContent>

                            <ItemActions>
                                <Button variant="secondary" size="sm" asChild>
                                    <Link href={patient_info.show(medicalRecord.patient_info_id)} as="button" prefetch>
                                        Patient Info
                                    </Link>
                                </Button>
                            </ItemActions>
                        </Item>

                        <HeadingSmall title="Medical Notes" />
                    </header>

                    <div
                        className="prose max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: medicalRecord.medical_notes_html }}
                    />
                </article>

                {/* TODO: Implement entries properly */}
                <Deferred data="entries" fallback={<div>Loading...</div>}>
                    <pre>{JSON.stringify({ entries }, null, 2)}</pre>
                </Deferred>
            </div>
        </Layout>
    );
}
