import categoryController from '@/actions/App/Http/Controllers/Article/CategoryController';
import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import Layout from '@/layouts/app-layout';
import { column } from '@/pages/manage/categories/column';
import categories from '@/routes/categories';
import type { BreadcrumbItem } from '@/types';
import { PaginationCategory } from '@/types/application/article';
import { Head, Link } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: categories.index.url(),
    },
];

export default function Index({ categories }: Readonly<{ categories: PaginationCategory }>) {
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />

            <div className="px-4 py-6">
                <div className="flex items-center justify-between">
                    <Heading title="Categories" description="Listing of all categories in the system." />

                    <Button variant="secondary" asChild>
                        <Link href={categoryController.create()} prefetch>
                            <PlusIcon aria-hidden /> New Category
                        </Link>
                    </Button>
                </div>
                <section aria-label="Categories Table">
                    <DataTable columns={column} data={categories.data} pagination={categories} />
                </section>
            </div>
        </Layout>
    );
}
