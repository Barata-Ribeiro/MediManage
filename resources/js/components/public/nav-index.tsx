import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
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
import { dashboard, home, login, register } from '@/routes';
import type { SharedData } from '@/types';
import { Article } from '@/types/application/article';
import { Link, usePage } from '@inertiajs/react';
import { Menu, NewspaperIcon } from 'lucide-react';

interface NavIndexProps {
    articles: Pick<Article, 'id' | 'title' | 'slug' | 'created_at'>[];
}

export default function NavIndex({ articles }: Readonly<NavIndexProps>) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="border-b border-sidebar-border/80 py-4">
            <div className="container flex items-center justify-between">
                <Link href={home()} className="w-max">
                    <AppLogo />
                </Link>

                {/*Mobile Menu*/}
                <div className="md:hidden">
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
                                    <AccordionItem value="articles" className="border-b-0">
                                        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
                                            Articles
                                        </AccordionTrigger>
                                        <AccordionContent className="mt-2">
                                            {articles.map((article) => (
                                                <Link
                                                    key={article.id}
                                                    href="#" // TODO: Add article link
                                                    className="flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
                                                >
                                                    <div className="text-foreground">
                                                        <NewspaperIcon aria-hidden size={16} />
                                                    </div>

                                                    <div>
                                                        <div className="text-sm font-semibold">{article.title}</div>
                                                        <p className="text-sm leading-snug text-muted-foreground">
                                                            Published on {article.created_at}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
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
                </div>

                <NavigationMenu className="hidden md:block">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link href={home()}>Home</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Articles</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[300px] gap-4">
                                    {articles.map((article) => (
                                        <li key={article.id}>
                                            <NavigationMenuLink asChild>
                                                <Link href="#">
                                                    {/*// TODO: Add article link*/}
                                                    <div className="font-medium">{article.title}</div>
                                                    <div className="text-muted-foreground">{article.created_at}</div>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
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
            </div>
        </div>
    );
}
