import medicalRecordController from '@/actions/App/Http/Controllers/Medical/MedicalRecordController';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import MedicalEntryModal from '@/components/helpers/medical-entry-modal';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemActions, ItemContent } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Layout from '@/layouts/app-layout';
import { normalizeString } from '@/lib/utils';
import medicalRecords from '@/routes/medicalRecords';
import patient_info from '@/routes/patient_info';
import type { BreadcrumbItem } from '@/types';
import { MedicalRecord, ScrollableMedicalRecordEntry } from '@/types/application/medicalRecord';
import { InfiniteScrollRef } from '@inertiajs/core';
import { Form, Head, InfiniteScroll, Link } from '@inertiajs/react';
import {
    ClipboardPlusIcon,
    EraserIcon,
    NotebookPenIcon,
    RefreshCcwDotIcon,
    SearchIcon,
    SquarePenIcon,
} from 'lucide-react';
import { Activity, useRef } from 'react';

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
            title: `View Record #${medicalRecord.id}`,
            href: medicalRecordController.show(medicalRecord.id).url,
        },
    ];

    const hasEntries = entries.data.length > 0;

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`Medical Record #${medicalRecord?.id ?? 'Show'}`} />

            <div className="container max-w-7xl px-6 py-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Medical Record"
                        description={`These are the medical notes for this record. Record ID: ${medicalRecord.id}`}
                    />

                    <Button variant="secondary" asChild>
                        <a href={medicalRecords.generatePdf(medicalRecord.id).url} target="_blank" rel="external">
                            Get PDF
                        </a>
                    </Button>
                </div>

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
                                <Button size="sm" asChild>
                                    <Link href={patient_info.show(medicalRecord.patient_info_id)} as="button" prefetch>
                                        Patient Info
                                    </Link>
                                </Button>
                            </ItemActions>
                        </Item>

                        <HeadingSmall title="Medical Notes" />
                    </header>

                    <div
                        className="prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: medicalRecord.medical_notes_html }}
                    />
                </article>

                <section className="mt-6 mb-4">
                    <HeadingSmall title="Entries" description="These are the entries for this medical record." />

                    {/* EMPTY STATE */}
                    <Activity mode={hasEntries ? 'hidden' : 'visible'}>
                        <Empty className="mt-4 border border-dashed">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <ClipboardPlusIcon aria-hidden />
                                </EmptyMedia>
                                <EmptyTitle>No Medical Entry</EmptyTitle>
                                <EmptyDescription className="text-balance">
                                    This medical record does not have any entries yet. Click the button below to add a
                                    new entry.
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    aria-label="Add New Entry"
                                    title="Add New Entry"
                                    asChild
                                >
                                    <Link href={medicalRecords.entries.create(medicalRecord.id)} prefetch as="button">
                                        Add New Entry
                                    </Link>
                                </Button>
                            </EmptyContent>
                        </Empty>
                    </Activity>

                    {/* ENTRIES TABLE */}
                    <Activity mode={hasEntries ? 'visible' : 'hidden'}>
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

                            <div className="inline-flex items-center gap-x-2">
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    title="Add New Entry"
                                    aria-label="Add New Entry"
                                    asChild
                                >
                                    <Link href={medicalRecords.entries.create(medicalRecord.id)} prefetch as="button">
                                        <NotebookPenIcon aria-hidden />
                                    </Link>
                                </Button>
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
                                            <TableRow key={entry.id} className="*:not-last:w-max">
                                                <TableCell className="font-medium">{entry.id}</TableCell>
                                                <TableCell>{entry.title}</TableCell>
                                                <TableCell className="capitalize">
                                                    {normalizeString(entry.entry_type)}
                                                </TableCell>
                                                <TableCell className="inline-flex w-full justify-end gap-2">
                                                    <MedicalEntryModal
                                                        id={entry.id}
                                                        medical_record_id={entry.medical_record_id}
                                                        employee_info_id={entry.employee_info_id}
                                                        appointment_id={entry.appointment_id}
                                                        title={entry.title}
                                                        content_html={entry.content_html}
                                                        entry_type={entry.entry_type}
                                                        is_visible_to_patient={entry.is_visible_to_patient}
                                                        created_at={entry.created_at}
                                                        updated_at={entry.updated_at}
                                                    />

                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        title="Edit Entry"
                                                        aria-label="Edit Entry"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={medicalRecordController.editEntry({
                                                                medicalRecord: medicalRecord.id,
                                                                medicalRecordEntry: entry.id,
                                                            })}
                                                            as="button"
                                                        >
                                                            <SquarePenIcon aria-hidden />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </InfiniteScroll>
                        </div>
                    </Activity>
                </section>
            </div>
        </Layout>
    );
}
