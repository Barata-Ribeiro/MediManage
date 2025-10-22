import LinkedinSvg from '@/components/public/linkedin-svg';
import XwitterSvg from '@/components/public/xwitter-svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useInitials } from '@/hooks/use-initials';
import Layout from '@/layouts/app/app-public-layout';
import { article as articleRoute } from '@/routes';
import { Article, RelatedArticle } from '@/types/application/article';
import { Deferred, Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';

interface ShowProps {
    article: Article;
    relatedArticles: RelatedArticle[];
}

export default function Show({ article, relatedArticles }: Readonly<ShowProps>) {
    const getInitials = useInitials();

    const pathname = globalThis.location.pathname;
    const canonicalUrl = `${globalThis.location.origin}${pathname}`;

    const hasRelatedArticles = relatedArticles?.length > 0;

    return (
        <Layout>
            <Head title={article.title}>
                <link rel="canonical" href={canonicalUrl} />
                <meta name="description" content={article.excerpt} />

                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.excerpt} />
                <meta property="og:image" content={article.thumbnail} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="article" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={article.title} />
                <meta name="twitter:description" content={article.excerpt} />
                <meta name="twitter:image" content={article.thumbnail} />
            </Head>

            <article>
                <header
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${article.thumbnail})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                    className="bg-gradient-overlay flex min-h-dvh flex-col items-center justify-center gap-y-6 text-center"
                >
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {article.categories!.map((category) => (
                            <Badge className="bg-background text-muted-foreground" key={category.id}>
                                {category.name}
                            </Badge>
                        ))}
                    </div>

                    <div className="inline-flex items-center gap-x-2 font-semibold">
                        <p>{article.reading_time} min read</p>
                        <Separator orientation="vertical" className="bg-muted-foreground" />
                        <time dateTime={article.created_at}>{format(article.created_at, 'PPP')}</time>
                    </div>

                    <h1 className="max-w-4xl text-4xl leading-tight font-bold text-balance sm:text-5xl lg:text-6xl">
                        {article.title}
                    </h1>
                    <p className="max-w-3xl text-lg text-balance text-muted-foreground">{article.excerpt}</p>

                    <div className="inline-flex items-center gap-x-4">
                        <Button size="icon" asChild>
                            <a
                                className="twitter-share-button"
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                    canonicalUrl,
                                )}&text=${encodeURIComponent(article.title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Share on X (formerly Twitter)"
                                title="Share on X (formerly Twitter)"
                            >
                                <XwitterSvg />
                            </a>
                        </Button>
                        <Button size="icon" asChild>
                            <a
                                className="linkedin-share-button"
                                href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
                                    canonicalUrl,
                                )}&title=${encodeURIComponent(article.title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Share on LinkedIn"
                                title="Share on LinkedIn"
                            >
                                <LinkedinSvg />
                            </a>
                        </Button>
                    </div>
                </header>

                <div className="container grid min-h-dvh grid-cols-1 items-start gap-x-8 gap-y-10 px-4 py-16 sm:grid-cols-[auto_1fr] sm:px-6 lg:px-8">
                    <aside className="w-96 rounded-lg border border-border p-4 max-sm:order-2">
                        <div className="mb-4">
                            <p className="text-xs text-muted-foreground">{article.reading_time} min read</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {article.categories?.map((category) => (
                                    <Badge variant="outline" key={category.id}>
                                        {category.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <Separator className="my-4" />

                        <Deferred
                            data="relatedArticles"
                            fallback={
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-x-3">
                                            <Skeleton className="h-12 w-20 rounded-md" />
                                            <div className="flex-1">
                                                <Skeleton className="mb-2 h-4 w-3/4 rounded-md" />
                                                <Skeleton className="h-3 w-1/2 rounded-md" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            }
                        >
                            <div className="space-y-3">
                                <h4 className="mb-2 text-lg font-semibold">Related Articles</h4>

                                {hasRelatedArticles ? (
                                    <div className="grid gap-6">
                                        {relatedArticles.map((relatedArticle) => {
                                            const route = articleRoute(relatedArticle.slug);
                                            const label = `Read more about '${relatedArticle.title}'`;
                                            const createdAt = format(
                                                new Date(relatedArticle.created_at),
                                                'MM · dd · yyyy',
                                            );

                                            return (
                                                <Link
                                                    href={route}
                                                    key={relatedArticle.id}
                                                    aria-label={label}
                                                    title={label}
                                                    className="group grid grid-cols-1 gap-2"
                                                >
                                                    <div className="relative min-h-48">
                                                        <img
                                                            src={relatedArticle.thumbnail}
                                                            alt={relatedArticle.title}
                                                            className="h-auto object-cover brightness-50 transition-all group-hover:brightness-100"
                                                        />
                                                        <time
                                                            dateTime={String(relatedArticle.created_at)}
                                                            className="absolute inset-0 h-max w-max rounded-br-lg bg-foreground px-2 py-1 text-sm text-background"
                                                        >
                                                            {createdAt}
                                                        </time>
                                                    </div>
                                                    <h5 className="text-xl font-semibold group-hover:text-primary group-active:text-primary/70">
                                                        {relatedArticle.title}
                                                    </h5>
                                                    <p className="text-shadow-900 text-sm">
                                                        By {relatedArticle.user?.name}
                                                    </p>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No related articles found.</p>
                                )}
                            </div>
                        </Deferred>
                    </aside>

                    <div className="grid gap-y-6">
                        <div className="flex items-center gap-x-4">
                            <Avatar className="size-14">
                                <AvatarImage src={article.user?.avatar} alt={article.user?.name} />
                                <AvatarFallback>{getInitials(article.user!.name!)}</AvatarFallback>
                            </Avatar>

                            <div className="grid gap-2">
                                <p className="text-sm leading-none font-medium">{article.user?.name}</p>
                                <time dateTime={String(article.created_at)} className="text-xs text-muted-foreground">
                                    {format(article.created_at, 'PPP')}
                                </time>
                            </div>
                        </div>

                        <h2 className="scroll-m-20 text-3xl font-bold tracking-tight">{article.title}</h2>
                        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{article.subtitle}</h3>

                        <div
                            className="prose prose-base lg:prose-xl dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: article.content_html }}
                        />
                    </div>
                </div>
            </article>
        </Layout>
    );
}
