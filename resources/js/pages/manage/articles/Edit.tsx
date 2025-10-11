import articleController from '@/actions/App/Http/Controllers/Article/ArticleController';
import EditArticleForm from '@/components/forms/manage/articles/edit-article-form';
import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Article, Category } from '@/types/application/article';
import { Head } from '@inertiajs/react';

interface EditProps {
    article: Article;
    categories: Pick<Category, 'name'>[];
}

export default function Edit({ article, categories }: Readonly<EditProps>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'My Articles',
            href: articleController.myIndex().url,
        },
        {
            title: `Editing #${article.id}`,
            href: articleController.edit(article.slug).url,
        },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Article #${article.id}`} />

            <div className="px-4 py-6">
                <Heading
                    title={`Edit Article #${article.id}`}
                    description="Modify the details of the selected article."
                />

                <section className="rounded-md bg-card p-4 shadow sm:p-6">
                    <EditArticleForm article={article} categories={categories} />
                </section>
            </div>
        </Layout>
    );
}
