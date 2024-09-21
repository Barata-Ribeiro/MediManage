import { notFound } from "next/navigation"
import { Metadata } from "next"
import getAllNoticesPaginated from "@/actions/notices/get-all-notices-paginated"
import StateError from "@/components/helpers/state-error"
import { ProblemDetails } from "@/interfaces/actions"
import { PaginatedNotices } from "@/interfaces/notices"
import NavigationPagination from "@/components/dashboard/filters/navigation-pagination"
import { twMerge } from "tailwind-merge"
import Link from "next/link"

interface NoticesPageProps {
    params: { username: string }
    searchParams?: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
    title: "Notices",
    description:
        "List all of the system notices issued by administrators. This list is available for all " +
        "employees and are public displayed to everyone who access the website or the application.",
}

export default async function NoticesPage({ params, searchParams }: Readonly<NoticesPageProps>) {
    if (!params.username) return notFound()
    if (!searchParams) return null

    const page = parseInt(searchParams.page as string, 10) || 0
    const perPage = parseInt(searchParams.perPage as string, 10) || 10
    const direction = (searchParams.direction as string) || "DESC"
    const orderBy = (searchParams.orderBy as string) || "createdAt"

    const state = await getAllNoticesPaginated(page, perPage, direction, orderBy)
    if (!state.ok) return <StateError error={state.error as ProblemDetails} />

    const pagination = state.response?.data as PaginatedNotices
    const content = pagination.content ?? []
    const pageInfo = pagination.page

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
                        List all of the system notices issued by administrators. This list is available for all
                        employees and are public displayed to everyone who access the website or the application.
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
                            <tbody>
                                {content.length > 0 &&
                                    content.map((notice, noticeIdx) => (
                                        <tr
                                            key={notice.id + "_" + noticeIdx}
                                            className="border-b border-neutral-300 bg-white">
                                            <td
                                                className={twMerge(
                                                    noticeIdx !== content.length - 1
                                                        ? "border-b border-neutral-200"
                                                        : "",
                                                    "whitespace-nowrap py-4 pl-4 pr-3 font-body text-sm font-medium text-neutral-900 sm:pl-6 lg:pl-8",
                                                )}>
                                                {notice.id}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    noticeIdx !== content.length - 1
                                                        ? "border-b border-neutral-200"
                                                        : "",
                                                    "hidden whitespace-nowrap px-3 py-4 font-body text-sm text-neutral-900 sm:table-cell",
                                                )}>
                                                {notice.title}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    noticeIdx !== content.length - 1
                                                        ? "border-b border-neutral-200"
                                                        : "",
                                                    "hidden whitespace-nowrap px-3 py-4 font-body text-sm text-neutral-900 sm:table-cell",
                                                )}>
                                                {notice.issuer.fullName ?? notice.issuer.username}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    noticeIdx !== content.length - 1
                                                        ? "border-b border-neutral-200"
                                                        : "",
                                                    "whitespace-nowrap px-3 py-4 font-body text-sm capitalize text-neutral-900",
                                                )}>
                                                {notice.type.toLowerCase()}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    noticeIdx !== content.length - 1
                                                        ? "border-b border-neutral-200"
                                                        : "",
                                                    "whitespace-nowrap px-3 py-4 font-body text-sm capitalize text-neutral-900",
                                                )}>
                                                {notice.status.toLowerCase()}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    noticeIdx !== content.length - 1
                                                        ? "border-b border-neutral-200"
                                                        : "",
                                                    "whitespace-nowrap py-4 pl-3 pr-4 font-body text-sm text-neutral-900 sm:pr-6 lg:pr-8",
                                                )}>
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/dashboard/${params.username}/notices/${notice.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-heading font-medium text-mourning-blue-600 hover:text-mourning-blue-700 active:text-mourning-blue-800">
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={`/dashboard/${params.username}/notices/${notice.id}/edit`}
                                                        className="font-heading font-medium text-mourning-blue-600 hover:text-mourning-blue-700 active:text-mourning-blue-800">
                                                        Edit
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                {content.length < 1 && (
                                    <tr className="border-b border-neutral-300 bg-white">
                                        <td
                                            colSpan={6}
                                            className="py-4 pl-4 pr-3 text-sm font-bold text-neutral-900 sm:pl-6 lg:pl-8">
                                            No notices found or available.
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
