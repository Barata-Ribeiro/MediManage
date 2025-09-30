import NavIndex from '@/components/public/nav-index';
import { Article } from '@/types/application/article';

interface WelcomeProps {
    latestArticles: Pick<Article, 'id' | 'title' | 'slug' | 'created_at'>[];
}

export default function Welcome({ latestArticles }: Readonly<WelcomeProps>) {
    return (
        <main>
            <NavIndex articles={latestArticles} />
        </main>
    );
}
