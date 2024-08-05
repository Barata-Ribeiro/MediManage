import { Metadata } from "next"
import { notFound } from "next/navigation"
import getAllConsultationsPaginated from "@/actions/consultations/get-all-consultations-paginated"
import { PaginatedConsultations } from "@/interfaces/consultations"
import NavigationPagination from "@/components/dashboard/filters/navigation-pagination"
import { twMerge } from "tailwind-merge"
import SearchFilter from "@/components/dashboard/filters/search-filter"
import Link from "next/link"

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
    const direction = (searchParams.direction as string) || "ASC"
    const orderBy = (searchParams.orderBy as string) || "updatedAt"

    const state = await getAllConsultationsPaginated(page, perPage, search, direction, orderBy)
    const pagination = state.response?.data as PaginatedConsultations
    const content = pagination.content
    const pageInfo = pagination.page

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-4 md:justify-between">
                <div className="w-max flex-auto">
                    <h1 className="w-max text-base font-bold leading-6 text-neutral-900">Consultations</h1>
                    <p className="mt-2 max-w-xl text-sm text-neutral-700">
                        List all of the consultations in the system and manage them. This list is available for both
                        assistants and doctors. You can search by patient, doctor, and filter through options.
                    </p>
                </div>
                <SearchFilter />
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
                                        Patient
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 hidden border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left font-heading text-sm font-semibold text-neutral-900 backdrop-blur backdrop-filter lg:table-cell">
                                        Doctor
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left font-heading text-sm font-semibold text-neutral-900 backdrop-blur backdrop-filter">
                                        Date
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
                            <tbody>
                                {content.length > 0 &&
                                    content.map((consult, consultIdx) => (
                                        <tr
                                            key={consult.id + "_" + consultIdx}
                                            className="border-b border-neutral-300 bg-white">
                                            <td
                                                className={twMerge(
                                                    consultIdx !== content.length - 1
                                                        ? "border-b border-neutral-200"
                                                        : "",
                                                    "whitespace-nowrap py-4 pl-4 pr-3 font-body text-sm font-medium text-neutral-900 sm:pl-6 lg:pl-8",
                                                )}>
                                                {consult.id}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    consultIdx !== content.length - 1
                                                        ? "border-b border-neutral-200"
                                                        : "",
                                                    "hidden whitespace-nowrap px-3 py-4 font-body text-sm text-neutral-900 sm:table-cell",
                                                )}>
                                                {consult.patient.username}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    consultIdx !== content.length - 1
                                                        ? "border-b border-neutral-200"
                                                        : "",
                                                    "hidden whitespace-nowrap px-3 py-4 font-body text-sm text-neutral-900 sm:table-cell",
                                                )}>
                                                {consult.doctor.username}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    consultIdx !== content.length - 1
                                                        ? "border-b border-neutral-200"
                                                        : "",
                                                    "relative whitespace-nowrap py-4 pl-3 pr-4 text-right font-body text-sm font-medium sm:pr-8 lg:pr-8",
                                                )}>
                                                {consult.scheduledTo}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    consultIdx !== content.length - 1
                                                        ? "border-b border-neutral-200"
                                                        : "",
                                                    "whitespace-nowrap px-3 py-4 font-body text-sm text-neutral-900",
                                                )}>
                                                {consult.status}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    consultIdx !== content.length - 1
                                                        ? "border-b border-neutral-200"
                                                        : "",
                                                    "relative whitespace-nowrap py-4 pl-3 pr-4 text-right font-body text-sm font-medium sm:pr-8 lg:pr-8",
                                                )}>
                                                <Link
                                                    href={`/dashboard/${params.username}/consultations/view?id=${consult.id}`}
                                                    className="font-heading font-semibold text-mourning-blue-600 hover:text-mourning-blue-700 active:text-mourning-blue-800">
                                                    View<span className="sr-only">, {consult.patient.username}</span>
                                                </Link>
                                            </td>
                                        </tr>
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
        </div>
    )
}
