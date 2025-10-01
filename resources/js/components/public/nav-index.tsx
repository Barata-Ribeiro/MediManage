import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import TextLink from '@/components/text-link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { article as articleRoute, articles as articlesRoute, dashboard, home, login, register } from '@/routes';
import type { Auth } from '@/types';
import { Article } from '@/types/application/article';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { Menu, NewspaperIcon } from 'lucide-react';
import { Fragment } from 'react/jsx-runtime';

interface NavIndexProps {
    auth: Auth;
    articles?: Pick<Article, 'id' | 'title' | 'slug' | 'created_at'>[];
}

export default function NavIndex({ articles, auth }: Readonly<NavIndexProps>) {
    const isMobile = useIsMobile();

    const currentPath = globalThis.location.pathname;
    const isIndex = currentPath === '/';
    const headerStyles = cn(
        'fixed inset-x-0 top-0 z-50 py-6 dark:border-b dark:bg-white/10 dark:shadow dark:backdrop-blur-sm',
        !isIndex && cn('border-b bg-white/20 shadow backdrop-blur-sm'),
    );

    return (
        <header className={headerStyles}>
            <div className="container flex items-center justify-between">
                <Link href={home()} className="w-max">
                    <AppLogo />
                </Link>

                {/*Mobile Menu*/}
                {isMobile && (
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="mr-2 cursor-pointer">
                                <Menu aria-hidden size={20} />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="right" className="overflow-y-hidden">
                            <SheetHeader className="border-b pb-4">
                                <AppLogoIcon className="h-8 w-max fill-current" aria-hidden />
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            </SheetHeader>

                            <div className="flex flex-col gap-6 p-4">
                                <Accordion type="single" collapsible className="border-b-0">
                                    <Link href={home()} className="text-md font-semibold">
                                        Home
                                    </Link>
                                    {articles && (
                                        <AccordionItem value="articles" className="border-b-0">
                                            <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
                                                Articles
                                            </AccordionTrigger>
                                            <AccordionContent className="mt-2">
                                                {articles.map((article) => (
                                                    <Link
                                                        key={article.id}
                                                        href={articleRoute(article.slug)}
                                                        className="flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
                                                        prefetch="hover"
                                                    >
                                                        <div className="text-foreground">
                                                            <NewspaperIcon aria-hidden size={16} />
                                                        </div>

                                                        <div>
                                                            <div className="text-sm font-semibold">{article.title}</div>
                                                            <p className="text-sm leading-snug text-muted-foreground">
                                                                Published on {format(article.created_at, 'PPP')}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                ))}

                                                <div className="mt-2 border-t pt-2 text-center">
                                                    <TextLink href={articlesRoute()}>Browse all articles</TextLink>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )}
                                </Accordion>
                                <div className="flex flex-col gap-3">
                                    {auth.user ? (
                                        <Button asChild variant="outline">
                                            <Link href={dashboard()}>Dashboard</Link>
                                        </Button>
                                    ) : (
                                        <>
                                            <Button asChild variant="outline">
                                                <Link href={login()}>Login</Link>
                                            </Button>
                                            <Button asChild>
                                                <Link href={register()}>Register</Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                )}

                {!isMobile && (
                    <Fragment>
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link href={home()}>Home</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                {articles && (
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger>Articles</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[300px] gap-4">
                                                {articles.map((article) => (
                                                    <li key={article.id}>
                                                        <NavigationMenuLink asChild>
                                                            <Link href={articleRoute(article.slug)} prefetch="hover">
                                                                <div className="font-medium">{article.title}</div>
                                                                <time
                                                                    dateTime={article.created_at}
                                                                    className="text-muted-foreground"
                                                                >
                                                                    Published on {format(article.created_at, 'PPP')}
                                                                </time>
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="-mx-2 mt-2 border-t p-4 text-center">
                                                <TextLink href={articlesRoute()}>Browse all articles</TextLink>
                                            </div>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                )}
                            </NavigationMenuList>
                        </NavigationMenu>

                        <div className="hidden items-center gap-x-4 md:flex">
                            {auth.user ? (
                                <Button variant="outline" asChild>
                                    <Link href={dashboard()}>Dashboard</Link>
                                </Button>
                            ) : (
                                <div className="inline-flex items-center gap-x-4">
                                    <Button variant="outline" asChild>
                                        <Link href={login()}>Log in</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={register()}>Register</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Fragment>
                )}
            </div>
        </header>
    );
}
