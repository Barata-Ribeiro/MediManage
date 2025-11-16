import AppLogo from '@/components/application/app-logo';
import AppLogoIcon from '@/components/application/app-logo-icon';
import AppNotice from '@/components/application/app-notice';
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
import { article as articleRoute, articles as articlesRoute, dashboard, home, login, register } from '@/routes';
import { prescription } from '@/routes/public';
import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Menu, NewspaperIcon } from 'lucide-react';
import { Activity, Fragment } from 'react';

export default function NavIndex() {
    const { auth, latestArticles, notices } = usePage<SharedData>().props;
    const { isMobile } = useIsMobile();

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b bg-white/20 shadow backdrop-blur-sm dark:border-b dark:bg-white/10 dark:shadow dark:backdrop-blur-sm">
            <AppNotice notices={notices} />
            <div className="container flex items-center justify-between py-6">
                <Link href={home()} className="w-max">
                    <AppLogo />
                </Link>

                {/*Mobile Menu*/}
                <Activity mode={isMobile ? 'visible' : 'hidden'}>
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
                                <Accordion type="single" collapsible className="grid gap-4 border-b-0">
                                    <Link href={home()} className="text-md font-semibold">
                                        Home
                                    </Link>
                                    {latestArticles && (
                                        <AccordionItem value="articles" className="border-b-0">
                                            <AccordionTrigger className="text-md cursor-pointer py-0 font-semibold hover:no-underline">
                                                Articles
                                            </AccordionTrigger>
                                            <AccordionContent className="mt-2">
                                                {latestArticles.map((article) => (
                                                    <Link
                                                        key={article.id}
                                                        href={articleRoute(article.slug)}
                                                        className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
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
                                    <Link href={prescription()} className="text-md font-semibold">
                                        Validate Prescription
                                    </Link>
                                </Accordion>
                                <div className="flex flex-col gap-3">
                                    {auth.user ? (
                                        <Button asChild variant="outline">
                                            <Link href={dashboard()}>Dashboard</Link>
                                        </Button>
                                    ) : (
                                        <Fragment>
                                            <Button asChild variant="outline">
                                                <Link href={login()}>Login</Link>
                                            </Button>
                                            <Button asChild>
                                                <Link href={register()}>Register</Link>
                                            </Button>
                                        </Fragment>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </Activity>

                <Activity mode={isMobile ? 'hidden' : 'visible'}>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href={home()}>Home</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            {latestArticles && (
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="cursor-pointer">Articles</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[300px] gap-4">
                                            {latestArticles.map((article) => (
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

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href={prescription()}>Validate Prescription</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
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
                </Activity>
            </div>
        </header>
    );
}
