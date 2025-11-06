import EditCategoryForm from '@/components/forms/manage/categories/edit-category-form';
import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import categories from '@/routes/categories';
import type { BreadcrumbItem } from '@/types';
import { Category } from '@/types/application/article';
import { Head } from '@inertiajs/react';

export default function Edit({ category }: Readonly<{ category: Category }>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Categories',
            href: categories.index.url(),
        },
        {
            title: 'Edit',
            href: categories.edit.url(category.id),
        },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Category - ${category.name}`} />

            <div className="px-4 py-6">
                <Heading
                    title={`Edit Category - ${category.name}`}
                    description="Update the category details, both name and description."
                />

                <section className="rounded-md bg-card p-4 shadow sm:p-6">
                    <EditCategoryForm category={category} />
                </section>
            </div>
        </Layout>
    );
}
