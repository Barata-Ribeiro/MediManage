import { Metadata } from "next"
import { notFound } from "next/navigation"
import getAllConsultationsPaginated from "@/actions/consultations/get-all-consultations-paginated"
import { PaginatedConsultations } from "@/interfaces/consultations"
import NavigationPagination from "@/components/dashboard/filters/navigation-pagination"
import SearchFilter from "@/components/dashboard/filters/search-filter"
import ConsultationTableRow from "@/components/dashboard/consultation-table-row"
import { FaPlus } from "react-icons/fa6"
import Link from "next/link"
import { ProblemDetails } from "@/interfaces/actions"
import StateError from "@/components/helpers/state-error"

interface ConsultationsPageProps {
    params: { username: string }
    searchParams?: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
    title: "Consultations",
    description: "List and manage all of the consultations in the system.",
}

export default async function ConsultationsPage({ params, searchParams }: Readonly<ConsultationsPageProps>) {
    if (!params.username) return notFound()
    if (!searchParams) return null

    const search = (searchParams.search as string) || ""
    const page = parseInt(searchParams.page as string, 10) || 0
    const perPage = parseInt(searchParams.perPage as string, 10) || 10
    const direction = (searchParams.direction as string) || "DESC"
    const orderBy = (searchParams.orderBy as string) || "scheduledTo"

    const state = await getAllConsultationsPaginated(page, perPage, search, direction, orderBy)
    if (!state.ok) return <StateError error={state.error as ProblemDetails} />

    const pagination = state.response?.data as PaginatedConsultations
    const content = pagination.content
    const pageInfo = pagination.page

    return (
        <section
            id="consultations-section"
            aria-labelledby="consultations-section-title"
            className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-4 md:justify-between">
                <div className="w-max flex-auto">
                    <h1
                        id="consultations-section-title"
                        className="w-max text-base font-bold leading-6 text-neutral-900">
                        Consultations
                    </h1>
                    <p className="mt-2 max-w-xl text-sm text-neutral-700">
                        List all of the consultations in the system and manage them. This list is available for both
                        assistants and doctors. You can search by patient, doctor, and filter through options.
                    </p>
                </div>

                <div className="grid w-max gap-4">
                    <SearchFilter />
                    <Link
                        href={`/dashboard/${params.username}/consultations/schedule`}
                        className="order-2 inline-flex w-max items-center gap-2 rounded-md bg-mourning-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-mourning-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mourning-blue-600 active:bg-mourning-blue-800 sm:order-1 sm:justify-self-end">
                        New Consultation <FaPlus className="inline-block" />
                    </Link>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left font-heading text-sm font-semibold text-neutral-900 sm:pl-6 lg:pl-8">
                                        Id
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left font-heading text-sm font-semibold text-neutral-900">
                                        Patient
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 hidden border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left font-heading text-sm font-semibold text-neutral-900 lg:table-cell">
                                        Doctor
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left font-heading text-sm font-semibold text-neutral-900">
                                        Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left font-heading text-sm font-semibold text-neutral-900">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {content.length > 0 &&
                                    content.map((consult, consultIdx) => (
                                        <ConsultationTableRow
                                            key={consult.id}
                                            index={consultIdx}
                                            length={content.length}
                                            consult={consult}
                                        />
                                    ))}

                                {content.length < 1 && (
                                    <tr className="border-b border-neutral-300 bg-white">
                                        <td
                                            colSpan={6}
                                            className="py-4 pl-4 pr-3 text-sm font-bold text-neutral-900 sm:pl-6 lg:pl-8">
                                            No consultations found or available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <NavigationPagination usePageInfo={pageInfo} contentSize={content.length} />
                    </div>
                </div>
            </div>
        </section>
    )
}
