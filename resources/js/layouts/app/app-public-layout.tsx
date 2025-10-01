import Footer from '@/components/public/footer';
import NavIndex from '@/components/public/nav-index';
import { SharedData } from '@/types';
import { Article } from '@/types/application/article';
import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

type LatestArticles = Pick<Article, 'id' | 'title' | 'slug' | 'created_at'>[];

export default function AppPublicLayout({ children }: Readonly<{ children: ReactNode }>) {
    const { auth, latestArticles } = usePage<SharedData>().props;

    return (
        <div className="bg-background">
            <NavIndex articles={latestArticles as LatestArticles} auth={auth} />

            <main>{children}</main>

            <Footer />
        </div>
    );
}
