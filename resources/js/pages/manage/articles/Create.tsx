import articleController from '@/actions/App/Http/Controllers/Article/ArticleController';
import NewArticleForm from '@/components/forms/manage/articles/new-article-form';
import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Category } from '@/types/application/article';
import { Head } from '@inertiajs/react';

interface CreateProps {
    categories: Pick<Category, 'name'>[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Articles',
        href: articleController.myIndex().url,
    },
    {
        title: 'Create',
        href: articleController.create().url,
    },
];

export default function Create({ categories }: Readonly<CreateProps>) {
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Write New Article" />

            <div className="px-4 py-6">
                <Heading title="New Article" description="Write a new article to share your knowledge and insights." />
                <section className="rounded-md bg-card p-4 shadow sm:p-6">
                    <NewArticleForm categories={categories} />
                </section>
            </div>
        </Layout>
    );
}
