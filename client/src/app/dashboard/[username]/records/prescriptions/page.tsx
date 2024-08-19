import { RecordsPageProps } from "@/app/dashboard/[username]/records/page"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import getAllPatientPrescriptionsPaginated from "@/actions/prescriptions/get-all-patient-prescriptions-paginated"
import { PaginatedSimplePrescriptions } from "@/interfaces/prescriptions"
import NavigationPagination from "@/components/dashboard/filters/navigation-pagination"
import { twMerge } from "tailwind-merge"
import parseDate from "@/utils/parse-date"
import Link from "next/link"

export async function generateMetadata({ searchParams }: Readonly<RecordsPageProps>): Promise<Metadata> {
    if (!searchParams?.user) return notFound()

    return {
        title: "Prescriptions of " + searchParams.user,
        description: "These are the prescriptions of the patient with the username " + searchParams.user + ".",
    }
}

export default async function PrescriptionsPage({ params, searchParams }: Readonly<RecordsPageProps>) {
    if (!params.username) return notFound()
    if (!searchParams) return null

    const userId = searchParams.user as string

    const page = parseInt(searchParams.page as string, 10) || 0
    const perPage = parseInt(searchParams.perPage as string, 10) || 10
    const direction = (searchParams.direction as string) || "ASC"
    const orderBy = (searchParams.orderBy as string) || "createdAt"

    const state = await getAllPatientPrescriptionsPaginated(userId, page, perPage, direction, orderBy)
    const pagination = state.response?.data as PaginatedSimplePrescriptions
    const content = pagination.content ?? []
    const pageInfo = pagination.page

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-4 md:justify-between">
                <div className="w-max flex-auto">
                    <h1 className="w-max text-base font-bold leading-6 text-neutral-900">Prescriptions</h1>
                    <p className="mt-2 max-w-xl text-sm text-neutral-700">
                        List all of the prescriptions for this patient. You can create a new prescription for this
                        patient.
                    </p>
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
                                        className="sticky top-0 z-10 hidden border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left font-heading text-sm font-semibold text-neutral-900 backdrop-blur backdrop-filter sm:table-cell">
                                        Doctor
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 hidden border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left font-heading text-sm font-semibold text-neutral-900 backdrop-blur backdrop-filter sm:table-cell">
                                        Issued At
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 font-heading backdrop-blur backdrop-filter sm:pr-6 lg:pr-8">
                                        <span className="sr-only">Manage</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {content.length > 0 &&
                                    content.map((pres, presIdx) => (
                                        <tr
                                            key={pres.id + "_" + presIdx}
                                            className="border-b border-neutral-300 bg-white">
                                            <td
                                                className={twMerge(
                                                    presIdx !== content.length - 1 ? "border-b border-neutral-200" : "",
                                                    "whitespace-nowrap py-4 pl-4 pr-3 font-body text-sm font-medium text-neutral-900 sm:pl-6 lg:pl-8",
                                                )}>
                                                {pres.id}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    presIdx !== content.length - 1 ? "border-b border-neutral-200" : "",
                                                    "hidden whitespace-nowrap px-3 py-4 font-body text-sm text-neutral-900 sm:table-cell",
                                                )}>
                                                {pres.patient.fullName ?? pres.patient.username}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    presIdx !== content.length - 1 ? "border-b border-neutral-200" : "",
                                                    "hidden whitespace-nowrap px-3 py-4 font-body text-sm text-neutral-900 sm:table-cell",
                                                )}>
                                                {pres.doctor.fullName ?? pres.doctor.username}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    presIdx !== content.length - 1 ? "border-b border-neutral-200" : "",
                                                    "whitespace-nowrap px-3 py-4 font-body text-sm text-neutral-900",
                                                )}>
                                                {parseDate(pres.createdAt)}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    presIdx !== content.length - 1 ? "border-b border-neutral-200" : "",
                                                    "whitespace-nowrap py-4 pl-3 pr-4 font-body text-sm text-neutral-900 sm:pr-6 lg:pr-8",
                                                )}>
                                                <Link
                                                    href="#"
                                                    className="font-heading font-semibold text-mourning-blue-600 hover:text-mourning-blue-700 active:text-mourning-blue-800">
                                                    View<span className="sr-only">, {pres.patient.username}</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}

                                {content.length < 1 && (
                                    <tr className="border-b border-neutral-300 bg-white">
                                        <td
                                            colSpan={6}
                                            className="py-4 pl-4 pr-3 text-sm font-bold text-neutral-900 sm:pl-6 lg:pl-8">
                                            No prescriptions to display.
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