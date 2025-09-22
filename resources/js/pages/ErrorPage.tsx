import { Head, Link } from '@inertiajs/react';
import backgroundImage from '../../../public/images/not-found.jpg';

export default function ErrorPage({ status }: { status: number }) {
    const title = {
        503: 'Service Unavailable',
        500: 'Server Error',
        404: 'Page Not Found',
        403: 'Forbidden',
    }[status];

    const description = {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'Sorry, the page you are looking for could not be found.',
        403: 'Sorry, you are forbidden from accessing this page.',
    }[status];

    const backgroundStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <main style={backgroundStyle} className="relative isolate flex h-dvh items-center">
            <Head title={title} />
            <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
                <p className="text-base leading-8 font-semibold text-neutral-50">{status}</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-50 sm:text-5xl">{title}</h1>
                <p className="mt-4 text-base text-neutral-50/70 sm:mt-6">{description}</p>
                <div className="mt-10 flex justify-center">
                    <Link href="/" className="text-sm leading-7 font-semibold text-neutral-50">
                        <span aria-hidden="true">&larr;</span> Back to home
                    </Link>
                </div>
            </div>
        </main>
    );
}
