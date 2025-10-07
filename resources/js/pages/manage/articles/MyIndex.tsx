import articleController from '@/actions/App/Http/Controllers/Article/ArticleController';
import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import Layout from '@/layouts/app-layout';
import { myColumn } from '@/pages/manage/articles/my-column';
import type { BreadcrumbItem } from '@/types';
import { PaginationArticle } from '@/types/application/article';
import { Head, Link } from '@inertiajs/react';
import { NotebookPenIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Articles',
        href: articleController.myIndex().url,
    },
];

export default function MyIndex({ articles }: Readonly<{ articles: PaginationArticle }>) {
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="All My Articles" />

            <div className="px-4 py-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <Heading title="My Articles" description="List of all my written articles" />

                    <Button variant="secondary" asChild>
                        <Link href={articleController.create().url} aria-label="Write New Article">
                            <NotebookPenIcon aria-hidden size={16} /> New Article
                        </Link>
                    </Button>
                </div>

                <section aria-label="Articles Table">
                    <DataTable columns={myColumn} data={articles.data} pagination={articles} />
                </section>
            </div>
        </Layout>
    );
}
