import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import { create, index } from '@/routes/notices';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notices',
        href: index().url,
    },
    {
        title: 'Create Notice',
        href: create().url,
    },
];

export default function Create() {
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Create Notice" />

            <div className="px-4 py-6">
                <Heading title="Create Notice" description="Fill out the form to create a new notice." />

                <section className="rounded-md bg-card p-4 shadow sm:p-6">
                    {/* TODO: Implement notice creation form */}
                </section>
            </div>
        </Layout>
    );
}
