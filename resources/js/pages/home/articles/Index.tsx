import AppPagination from '@/components/app-pagination';
import ArticleFilterForm from '@/components/forms/home/article-filter-form';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import Layout from '@/layouts/app/app-public-layout';
import { article as articleRoute } from '@/routes';
import { PaginationMeta } from '@/types';
import { Article, Category } from '@/types/application/article';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';

type SimpleArticle = Omit<Article, 'subtitle' | 'content_html' | 'content_json' | 'is_published' | 'updated_at'>;

interface IndexProps {
    articles: PaginationMeta<SimpleArticle[]>;
    categories: Category[];
}

export default function Index({ articles: paginatedArticles, categories }: Readonly<IndexProps>) {
    const { data: articles, ...pagination } = paginatedArticles;

    return (
        <Layout>
            <Head title="All Articles" />

            <div className="isolate container pt-32 lg:pt-36">
                <Heading title="All Articles" description="Browse all articles." />

                <ArticleFilterForm />

                <ul className="my-8 grid grid-cols-1 gap-6 border-t pt-8 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => {
                        const key = `article-${article.id}`;
                        const thumbnail = article.thumbnail;

                        return (
                            <li key={key} className="group relative grid gap-4">
                                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                                    <img
                                        src={thumbnail}
                                        alt={article.title}
                                        className="rounded-lg object-cover transition duration-300 group-hover:scale-110"
                                    />
                                </div>

                                <div className="absolute top-0 left-0 inline-flex items-center-safe gap-x-1 divide-x rounded-br-lg bg-background px-6 py-3">
                                    <time
                                        className="pr-2 text-xs text-gray-500 dark:text-gray-400"
                                        dateTime={article.created_at}
                                    >
                                        {format(article.created_at, 'MMM dd, yyyy')}
                                    </time>
                                    <p className="pl-2 text-xs text-gray-500 dark:text-gray-400">
                                        By {article.user?.name}
                                    </p>
                                </div>

                                <div className="grid">
                                    <h3 className="text-lg leading-7 font-semibold group-hover:text-primary">
                                        <Link href={articleRoute(article.slug)}>
                                            <span className="absolute inset-0" />
                                            {article.title}
                                        </Link>
                                    </h3>
                                    <p className="text-sm text-balance text-muted-foreground">{article.excerpt}</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {article.categories?.map((category) => {
                                            const categoryKey = `article-${article.id}-category-${category.id}`;
                                            return (
                                                <Badge
                                                    key={categoryKey}
                                                    className="text-xs font-medium"
                                                    variant="secondary"
                                                >
                                                    {category.name}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                <AppPagination pagination={pagination} />
            </div>
        </Layout>
    );
}
