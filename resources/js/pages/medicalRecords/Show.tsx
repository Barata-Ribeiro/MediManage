import medicalRecordController from '@/actions/App/Http/Controllers/Medical/MedicalRecordController';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemActions, ItemContent } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Layout from '@/layouts/app-layout';
import medicalRecords from '@/routes/medicalRecords';
import patient_info from '@/routes/patient_info';
import type { BreadcrumbItem } from '@/types';
import { MedicalRecord, ScrollableMedicalRecordEntry } from '@/types/application/medicalRecord';
import { InfiniteScrollRef } from '@inertiajs/core';
import { Form, Head, InfiniteScroll, Link } from '@inertiajs/react';
import { EraserIcon, RefreshCcwDotIcon, SearchIcon } from 'lucide-react';
import { useRef } from 'react';

interface ShowProps {
    medicalRecord: MedicalRecord;
    entries: ScrollableMedicalRecordEntry;
}

export default function Show({ medicalRecord, entries }: Readonly<ShowProps>) {
    const infiniteScrollRef = useRef<InfiniteScrollRef | null>(null);

    const fetchNext = () => {
        infiniteScrollRef.current?.fetchNext?.();
    };

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

                <section className="my-4">
                    <HeadingSmall title="Entries" description="These are the entries for this medical record." />

                    <div className="flex items-end justify-between">
                        <Form
                            {...medicalRecords.show.form(medicalRecord.id)}
                            options={{ preserveScroll: true, replace: true }}
                            disableWhileProcessing
                            className="mt-4 inert:pointer-events-none inert:opacity-50 inert:grayscale-100"
                        >
                            <Field className="max-w-sm">
                                <FieldLabel htmlFor="search">Search</FieldLabel>
                                <ButtonGroup>
                                    <Input type="search" id="search" name="search" placeholder="e.g. Blood Test" />

                                    <Button
                                        type="button"
                                        variant="outline"
                                        aria-label="Reset results"
                                        title="Reset results"
                                        asChild
                                    >
                                        <Link href={medicalRecords.show(medicalRecord.id)} prefetch as="button">
                                            <EraserIcon aria-hidden />
                                        </Link>
                                    </Button>
                                    <Button type="submit" aria-label="Search" title="Search">
                                        <SearchIcon aria-hidden />
                                    </Button>
                                </ButtonGroup>
                            </Field>
                        </Form>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={fetchNext}
                            title="Load more entries"
                            aria-label="Load more entries"
                            disabled={entries.next_cursor === null && !infiniteScrollRef.current?.hasNext()}
                        >
                            <RefreshCcwDotIcon aria-hidden />
                        </Button>
                    </div>

                    <div className="mt-2 overflow-hidden rounded-lg border">
                        <InfiniteScroll
                            ref={infiniteScrollRef}
                            data="entries"
                            manual
                            itemsElement="#table-body"
                            startElement="#table-body"
                        >
                            <Table>
                                <TableHeader id="table-header">
                                    <TableRow>
                                        <TableHead className="w-[100px]">ID</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead className="w-[150px]">Type</TableHead>
                                        <TableHead className="w-[150px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody id="table-body">
                                    {entries?.data.map((entry) => (
                                        <TableRow key={entry.id} className="[&>*]:w-max">
                                            <TableCell className="font-medium">{entry.id}</TableCell>
                                            <TableCell>{entry.title}</TableCell>
                                            <TableCell className="capitalize">{entry.entry_type}</TableCell>
                                            <TableCell className="text-right">TODO</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </InfiniteScroll>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
