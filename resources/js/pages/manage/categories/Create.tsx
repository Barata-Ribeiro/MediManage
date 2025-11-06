import NewCategoryForm from '@/components/forms/manage/categories/new-category-form';
import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import categories from '@/routes/categories';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: categories.index.url(),
    },
    {
        title: 'Create',
        href: categories.create.url(),
    },
];

export default function Create() {
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Create Category" />

            <div className="px-4 py-6">
                <Heading title="New Category" description="Create a new category for articles." />

                <section className="rounded-md bg-card p-4 shadow sm:p-6">
                    <NewCategoryForm />
                </section>
            </div>
        </Layout>
    );
}
