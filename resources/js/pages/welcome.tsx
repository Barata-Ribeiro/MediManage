import PatternSVG from '@/components/public/pattern-svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';
import Layout from '@/layouts/app/app-public-layout';
import { article as articleRoute, register } from '@/routes';
import { Article } from '@/types/application/article';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { MoveRightIcon } from 'lucide-react';

interface WelcomeProps {
    latestArticles: Pick<Article, 'id' | 'title' | 'slug' | 'thumbnail' | 'created_at' | 'user'>[];
}

export default function Welcome({ latestArticles }: Readonly<WelcomeProps>) {
    const getInitials = useInitials();

    const photos = {
        photo1: 'https://images.unsplash.com/photo-1584467735867-4297ae2ebcee',
        photo2: 'https://images.unsplash.com/photo-1631248207065-771ae9ac32f0',
        photo3: 'https://images.unsplash.com/photo-1729842626715-9327b3ce8661',
        photo4: 'https://images.unsplash.com/photo-1752842350772-2921657e50d7',
        photo5: 'https://images.unsplash.com/photo-1755190475518-3c53f61864d2',
    };

    return (
        <Layout>
            <Head title="Welcome to MediManage">
                <meta name="description" content="MediManage - Your Health, Our Priority" />
            </Head>

            <section id="hero-section" className="relative isolate">
                <PatternSVG />
                <div
                    aria-hidden
                    className="absolute top-0 right-0 left-1/2 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
                        }}
                        className="aspect-801/1036 w-[50.0625rem] bg-linear-to-tr from-[#12ABC9] to-[#124fc9] opacity-30"
                    />
                </div>

                <div className="overflow-hidden">
                    <div className="mx-auto max-w-7xl px-6 pt-36 pb-32 sm:pt-60 lg:px-8 lg:pt-32">
                        <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                            <div className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl">
                                <h1 className="text-5xl font-semibold tracking-tight text-pretty sm:text-7xl">
                                    Your Health, Our Priority
                                </h1>
                                <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:max-w-md sm:text-xl/8 lg:max-w-none dark:text-gray-400">
                                    Join us today to access top-notch healthcare services, expert advice, and
                                    personalized care plans tailored to your needs. Your journey to better health starts
                                    here.
                                </p>
                                <div className="mt-10 flex items-center gap-x-6">
                                    <Button asChild>
                                        <Link href={register()} prefetch>
                                            Register
                                        </Link>
                                    </Button>

                                    {/*TODO: Link to about us page*/}
                                    <Button variant="ghost">
                                        About Us <MoveRightIcon aria-hidden size={16} />
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                                <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                                    <div className="relative">
                                        <img
                                            alt="Doctor wearing a mask, with a stethoscope around his neck"
                                            src={`${photos.photo1}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80`}
                                            className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                        />
                                        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset" />
                                    </div>
                                </div>
                                <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                                    <div className="relative">
                                        <img
                                            alt="The corridor of a modern building, with a white couch and plants in front of a windowed wall"
                                            src={`${photos.photo2}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80`}
                                            className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                        />
                                        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset" />
                                    </div>
                                    <div className="relative">
                                        <img
                                            alt="A female doctor holding a red stethoscope"
                                            src={`${photos.photo3}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=396&h=528&q=80`}
                                            className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                        />
                                        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset" />
                                    </div>
                                </div>
                                <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                                    <div className="relative">
                                        <img
                                            alt="Set of ampoules on a petri dish"
                                            src={`${photos.photo4}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=left&w=400&h=528&q=80`}
                                            className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                        />
                                        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset" />
                                    </div>
                                    <div className="relative">
                                        <img
                                            alt="Clinic personel carrying a white box of medical supplies"
                                            src={`${photos.photo5}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80`}
                                            className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                                        />
                                        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="blog-section" className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                            Latest Articles
                        </h2>
                        <p className="mt-2 text-lg/8 text-gray-600 dark:text-gray-400">
                            Stay informed with our latest articles on health tips, medical news, and wellness advice
                            from our experts.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {latestArticles.map((article) => (
                            <article
                                key={article.id}
                                className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pt-80 pb-8 sm:pt-48 lg:pt-80"
                            >
                                <img
                                    alt="Article thumbnail"
                                    src={article.thumbnail}
                                    className="absolute inset-0 -z-10 size-full object-cover"
                                />
                                <div className="absolute inset-0 -z-10 bg-linear-to-t from-gray-900 via-gray-900/40 to-transparent dark:via-gray-900/20" />
                                <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-gray-900/10 ring-inset dark:ring-gray-50/10" />

                                <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm/6 text-gray-300">
                                    <time dateTime={article.created_at} className="mr-8">
                                        {format(article.created_at, 'PPP')}
                                    </time>
                                    <div className="-ml-4 flex items-center gap-x-4">
                                        <svg viewBox="0 0 2 2" className="-ml-0.5 size-0.5 flex-none fill-white/50">
                                            <circle r={1} cx={1} cy={1} />
                                        </svg>
                                        <div className="flex items-center-safe gap-x-2.5">
                                            <Avatar className="m-1 size-6 flex-none rounded-full bg-white/10">
                                                <AvatarImage src={article.user?.avatar} alt={article.user?.name} />
                                                <AvatarFallback className="rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                    {getInitials(article.user!.name!)}
                                                </AvatarFallback>
                                            </Avatar>
                                            {article.user?.name}
                                        </div>
                                    </div>
                                </div>
                                <h3 className="mt-3 text-lg/6 font-semibold text-white">
                                    <Link href={articleRoute(article.slug)} prefetch>
                                        <span className="absolute inset-0" />
                                        {article.title}
                                    </Link>
                                </h3>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
