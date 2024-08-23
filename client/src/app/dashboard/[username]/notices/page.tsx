import { notFound } from "next/navigation"
import { Metadata } from "next"

interface NoticesPageProps {
    params: { username: string }
    searchParams?: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
    title: "Notices",
    description: "List all of the system notices issued by the employees.",
}

export default function NoticesPage({ params, searchParams }: Readonly<NoticesPageProps>) {
    if (!params.username) return notFound()
    if (!searchParams) return null

    const page = parseInt(searchParams.page as string, 10) || 0
    const perPage = parseInt(searchParams.perPage as string, 10) || 10
    const direction = (searchParams.direction as string) || "ASC"
    const orderBy = (searchParams.orderBy as string) || "createdAt"
    return (
        <section id="notices-section" aria-labelledby="notices-section-title" className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-4 md:justify-between">
                <div className="w-max flex-auto">
                    <h1
                        id="medical-records-section-title"
                        className="w-max text-base font-bold leading-6 text-neutral-900">
                        Notices
                    </h1>
                    <p className="mt-2 max-w-xl text-sm text-neutral-700">
                        List all of the system notices issued by the employees. This list is available for all employees
                        and are public displayed to everyone who access the website or the application.
                    </p>
                </div>

                {/*ADD FILTERS HERE*/}
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left font-heading text-sm font-semibold text-neutral-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">
                                        Id
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 hidden border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left font-heading text-sm font-semibold text-neutral-900 backdrop-blur backdrop-filter sm:table-cell">
                                        Title
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 hidden border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left font-heading text-sm font-semibold text-neutral-900 backdrop-blur backdrop-filter sm:table-cell">
                                        Issuer
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left font-heading text-sm font-semibold text-neutral-900 backdrop-blur backdrop-filter">
                                        Notice Type
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left font-heading text-sm font-semibold text-neutral-900 backdrop-blur backdrop-filter">
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 font-heading backdrop-blur backdrop-filter sm:pr-6 lg:pr-8">
                                        <span className="sr-only">View/Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    )
}
