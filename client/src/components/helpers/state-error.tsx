import { ProblemDetails } from "@/interfaces/actions"
import Link from "next/link"

interface StateErrorProps {
    error: ProblemDetails
}

export default function StateError({ error }: Readonly<StateErrorProps>) {
    return (
        <section className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center font-body">
                <p className="font-heading text-base font-semibold text-mourning-blue-600">{error.status ?? "Error"}</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    {error.title ?? "An error occurred"}
                </h1>
                <p className="mt-6 text-base leading-7 text-gray-600">
                    {error.detail ?? "An unkown error has occurred."}
                </p>
                <div className="mt-10 inline-block gap-x-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-md bg-mourning-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-mourning-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mourning-blue-600 active:bg-mourning-blue-800">
                        <span aria-hidden>&larr;</span> Back to home
                    </Link>
                </div>
            </div>
        </section>
    )
}
