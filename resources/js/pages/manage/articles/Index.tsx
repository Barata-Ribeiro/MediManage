import articleController from '@/actions/App/Http/Controllers/Article/ArticleController';
import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import Layout from '@/layouts/app-layout';
import { column } from '@/pages/manage/articles/column';
import type { BreadcrumbItem } from '@/types';
import { PaginationArticle } from '@/types/application/article';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Articles',
        href: articleController.index().url,
    },
];

export default function Index({ articles }: Readonly<{ articles: PaginationArticle }>) {
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="List of Articles" />

            <div className="px-4 py-6">
                <div className="flex items-center justify-between">
                    <Heading title="Articles" description="List of all articles" />

                    <Button>
                        <Link href={articleController.create().url}>Create Article</Link>
                    </Button>
                </div>

                <section aria-label="Articles Table">
                    <DataTable columns={column} data={articles.data} pagination={articles} />
                </section>
            </div>
        </Layout>
    );
}
