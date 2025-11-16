import AppPageAlert from '@/components/application/app-page-alert';
import Heading from '@/components/heading';
import renderLoadMore from '@/components/helpers/load-more-button';
import PatientSimpleCard from '@/components/helpers/patient-simple-card';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Input } from '@/components/ui/input';
import { ItemGroup } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import Layout from '@/layouts/app-layout';
import { search } from '@/routes/patient_info';
import type { BreadcrumbItem } from '@/types';
import { ScrollablePatientInfo } from '@/types/application/patient';
import { Form, Head, InfiniteScroll, Link } from '@inertiajs/react';
import { EraserIcon, SearchIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Find Patient',
        href: search().url,
    },
];

export default function Find({ patients }: Readonly<{ patients: ScrollablePatientInfo }>) {
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Find a Patient" />

            <div className="px-4 py-6">
                <Heading
                    title="Find a Patient"
                    description="Search for existing patients in the system so you can view or manage their information."
                />

                <section className="rounded-md bg-card p-4 shadow sm:p-6">
                    <AppPageAlert
                        title="Be Aware!"
                        message="Viewing and managing patient information is a sensitive task. Ensure you have the necessary permissions and always adhere to privacy regulations when accessing patient data."
                        variant="warning"
                    />

                    <Form
                        method={search.form().method}
                        options={{ preserveScroll: true }}
                        disableWhileProcessing
                        action={search.form().action}
                        className="mx-auto max-w-3xl inert:pointer-events-none inert:opacity-50 inert:grayscale-100"
                    >
                        <Label htmlFor="search">Search</Label>

                        <ButtonGroup className="mt-2 w-full">
                            <Input
                                type="search"
                                id="search"
                                name="search"
                                placeholder="e.g. Jason Bourne"
                                autoComplete="off"
                            />

                            <Button
                                type="button"
                                variant="outline"
                                aria-label="Reset results"
                                title="Reset results"
                                asChild
                            >
                                <Link href={search()} prefetch as="button">
                                    <EraserIcon aria-hidden />
                                </Link>
                            </Button>
                            <Button type="submit" aria-label="Search patient" title="Search patient">
                                <SearchIcon aria-hidden />
                            </Button>
                        </ButtonGroup>
                    </Form>
                </section>

                <section id="results" className="mt-6">
                    <InfiniteScroll data="patients" manual next={renderLoadMore} itemsElement="#item-group">
                        <ItemGroup id="item-group" className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                            {patients.data.map((patient) => (
                                <PatientSimpleCard key={patient.id} patient={patient} />
                            ))}
                        </ItemGroup>
                    </InfiniteScroll>
                </section>
            </div>
        </Layout>
    );
}
