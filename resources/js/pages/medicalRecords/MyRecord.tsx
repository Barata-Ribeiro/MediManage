import AppPageAlert from '@/components/app-page-alert';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import PatientEntryViewModal from '@/components/helpers/patient-entry-view-modal';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemActions, ItemContent } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Layout from '@/layouts/app-layout';
import { normalizeString } from '@/lib/utils';
import medicalRecords, { myRecord } from '@/routes/medicalRecords';
import patient_info from '@/routes/patient_info';
import type { BreadcrumbItem } from '@/types';
import { MedicalRecord, ScrollableMedicalRecordEntry } from '@/types/application/medicalRecord';
import { InfiniteScrollRef } from '@inertiajs/core';
import { Form, Head, InfiniteScroll, Link } from '@inertiajs/react';
import { format } from 'date-fns/format';
import { ClipboardIcon, EraserIcon, RefreshCcwDotIcon, SearchIcon } from 'lucide-react';
import { Fragment, useRef } from 'react';

interface MyRecordProps {
    medicalRecord: MedicalRecord;
    entries: ScrollableMedicalRecordEntry;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Medical Record',
        href: myRecord().url,
    },
];

export default function MyRecord({ medicalRecord, entries }: Readonly<MyRecordProps>) {
    const infiniteScrollRef = useRef<InfiniteScrollRef | null>(null);

    const fetchNext = () => infiniteScrollRef.current?.fetchNext?.();

    const hasEntries = entries.data.length > 0;

    const dateOfBirth = String(medicalRecord.patient_info?.date_of_birth).replaceAll('-', '/');

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="My Medical Record" />

            <div className="container max-w-7xl px-6 py-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Your Medical Record"
                        description="Check your medical history and download your records as a PDF."
                    />

                    <Button variant="secondary" asChild>
                        <a href={medicalRecords.generatePdf(medicalRecord.id).url} target="_blank" rel="external">
                            Get PDF
                        </a>
                    </Button>
                </div>

                <article className="space-y-2 [&>header]:space-y-4">
                    <header className="mb-4">
                        <Item variant="muted">
                            <ItemContent>
                                <dl className="flex flex-col justify-evenly gap-8 sm:flex-row">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Patient
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            {medicalRecord.patient_info.full_name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Date of Birth
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            {format(dateOfBirth, 'PPP')} ({medicalRecord.patient_info.age} years old)
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
                                        View My Info
                                    </Link>
                                </Button>
                            </ItemActions>
                        </Item>
                    </header>

                    <HeadingSmall title="Medical Notes" />

                    <div
                        className="prose -mt-2 max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: medicalRecord.medical_notes_html }}
                    />
                </article>

                <section className="mt-6 mb-4">
                    <AppPageAlert
                        title="Attention!"
                        message="Your medical record entries are visible to you only if your medical practitioner has marked them as visible. If you believe there are entries missing from your record, please contact them for clarification."
                        variant="warning"
                    />

                    <HeadingSmall title="Entries" description="Check your medical record entries." />

                    {!hasEntries && (
                        <Empty className="mt-4 border border-dashed">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <ClipboardIcon aria-hidden />
                                </EmptyMedia>
                                <EmptyTitle>No Medical Entry</EmptyTitle>
                                <EmptyDescription className="text-balance">
                                    No medical record entries were found in your medical record. Either your medical
                                    practitioner has not added any entries yet, or there are no entries that match your
                                    search criteria.
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    aria-label="Refresh Page"
                                    title="Refresh Page"
                                    asChild
                                >
                                    <Link href={myRecord()} prefetch as="button">
                                        Refresh Page
                                    </Link>
                                </Button>
                            </EmptyContent>
                        </Empty>
                    )}

                    {hasEntries && (
                        <Fragment>
                            <div className="flex items-end justify-between">
                                <Form
                                    {...medicalRecords.myRecord.form()}
                                    options={{ preserveScroll: true, replace: true }}
                                    disableWhileProcessing
                                    className="mt-4 inert:pointer-events-none inert:opacity-50 inert:grayscale-100"
                                >
                                    <Field className="max-w-sm">
                                        <FieldLabel htmlFor="search">Search</FieldLabel>
                                        <ButtonGroup>
                                            <Input
                                                type="search"
                                                id="search"
                                                name="search"
                                                placeholder="e.g. Blood Test"
                                            />

                                            <Button
                                                type="button"
                                                variant="outline"
                                                aria-label="Reset results"
                                                title="Reset results"
                                                asChild
                                            >
                                                <Link href={myRecord()} prefetch as="button">
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
                                                <TableRow key={entry.id} className="*:not-last:w-max">
                                                    <TableCell className="font-medium">{entry.id}</TableCell>
                                                    <TableCell>{entry.title}</TableCell>
                                                    <TableCell className="capitalize">
                                                        {normalizeString(entry.entry_type)}
                                                    </TableCell>
                                                    <TableCell className="inline-flex w-full justify-end gap-2">
                                                        <PatientEntryViewModal entry={entry} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </InfiniteScroll>
                            </div>
                        </Fragment>
                    )}
                </section>
            </div>
        </Layout>
    );
}
