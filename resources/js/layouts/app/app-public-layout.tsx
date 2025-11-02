import ScrollToTop from '@/components/helpers/scroll-to-top';
import Footer from '@/components/public/footer';
import NavIndex from '@/components/public/nav-index';
import { ReactNode } from 'react';

export default function AppPublicLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <div className="bg-background">
            <NavIndex />

            <main>{children}</main>

            <Footer />
            <ScrollToTop />
        </div>
    );
}
