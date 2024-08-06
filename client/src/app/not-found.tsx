import { Metadata } from "next"
import Link from "next/link"
import notFoundImage from "../../public/images/not-found.jpg"
import Image from "next/image"

export const metadata: Metadata = {
    title: "404 - Not Found",
    description: "This page does not exist.",
}

export default function NotFound() {
    return (
        <main className="relative isolate flex min-h-full items-center">
            <Image
                src={notFoundImage.src}
                alt="Image of an empty IV bag, hanging from a pole. Photo by Marcelo Leal on Unsplash."
                className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
                quality={100}
                priority
                fill
            />
            <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
                <p className="text-base font-semibold leading-8 text-neutral-50">404</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-50 sm:text-5xl">Page not found</h1>
                <p className="mt-4 text-base text-neutral-50/70 sm:mt-6">
                    Sorry, we couldn’t find the page you’re looking for.
                </p>
                <div className="mt-10 flex justify-center">
                    <Link href="/" className="text-sm font-semibold leading-7 text-neutral-50">
                        <span aria-hidden="true">&larr;</span> Back to home
                    </Link>
                </div>
            </div>
        </main>
    )
}
