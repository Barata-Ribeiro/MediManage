import { notFound } from "next/navigation"
import getAllUserNotifications from "@/actions/notifications/get-all-user-notifications"
import getUserContext from "@/actions/users/get-user-context"
import StateError from "@/components/helpers/state-error"
import { ProblemDetails } from "@/interfaces/actions"
import { User } from "@/interfaces/users"
import { PaginatedNotifications } from "@/interfaces/notifications"
import NavigationPagination from "@/components/dashboard/filters/navigation-pagination"
import { twMerge } from "tailwind-merge"
import { IoMailOpen, IoMailUnread } from "react-icons/io5"
import type { Metadata } from "next"
import parseDate from "@/utils/parse-date"
import NotificationMessageModal from "@/components/modals/notification-message-modal"
import NotifFilter from "@/components/dashboard/filters/notif-filter"
import Link from "next/link"
import NotificationDeleteModal from "@/components/modals/notification-delete-modal"

interface NotificationsPageProps {
    params: { username: string }
    searchParams?: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
    title: "Your notifications",
    description: "View all your notifications here in one place.",
}

export default async function NotificationsPage({ params, searchParams }: Readonly<NotificationsPageProps>) {
    if (!params.username) return notFound()
    if (!searchParams) return null

    const page = parseInt(searchParams.page as string, 10) || 0
    const perPage = parseInt(searchParams.perPage as string, 10) || 10
    const direction = (searchParams.direction as string) || "DESC"
    const orderBy = (searchParams.orderBy as string) || "issuedAt"
    const isRead = (searchParams.isRead as string) || ""

    const contextState = await getUserContext()
    if (!contextState.ok) return <StateError error={contextState.error as ProblemDetails} />
    const user = contextState.response?.data as User

    const notifState = await getAllUserNotifications(user.id, page, perPage, direction, orderBy, isRead)
    if (!notifState.ok) return <StateError error={notifState.error as ProblemDetails} />

    const pagination = notifState.response?.data as PaginatedNotifications
    const content = pagination.content
    const pageInfo = pagination.page

    return (
        <section
            id="notification-section"
            aria-labelledby="notification-section-title"
            className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-4 md:justify-between">
                <div className="w-max flex-auto">
                    <h1
                        id="notification-section-title"
                        className="w-max text-base font-bold leading-6 text-neutral-900">
                        Notifications
                    </h1>
                    <p className="mt-2 max-w-xl text-sm text-neutral-700">
                        View all your notifications here in one place. You can mark them as read or unread. Or you can
                        delete them if you don&apos;t need them anymore.
                    </p>
                </div>

                <NotifFilter />
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">
                                        <span className="sr-only">
                                            Check multiple notifications at once by selecting the checkbox
                                        </span>
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-neutral-900 backdrop-blur backdrop-filter">
                                        Id
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-neutral-900 backdrop-blur backdrop-filter">
                                        Title
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 hidden border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-neutral-900 backdrop-blur backdrop-filter sm:table-cell">
                                        Issued At
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8">
                                        <span className="sr-only">View/Delete</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {content.length > 0 &&
                                    content.map((notif, notifIdx) => {
                                        const isRead = notif.isRead
                                        const isLast = notifIdx !== content.length - 1
                                        return (
                                            <tr
                                                key={notif.id + "_" + notifIdx}
                                                className={twMerge(
                                                    isRead ? "bg-neutral-50" : "bg-white",
                                                    "border-b border-neutral-300",
                                                )}>
                                                <td></td>
                                                <td
                                                    className={twMerge(
                                                        isLast ? "border-b border-neutral-200" : "",
                                                        "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6 lg:pl-8",
                                                    )}>
                                                    {notif.id}
                                                </td>
                                                <td
                                                    className={twMerge(
                                                        isLast ? "border-b border-neutral-200" : "",
                                                        isRead ? "font-normal" : "font-medium",
                                                        "inline-flex w-full gap-2 whitespace-nowrap px-3 py-4 text-sm text-neutral-900",
                                                    )}>
                                                    {isRead ? (
                                                        <IoMailOpen className="h-5 w-5" aria-hidden title="Read" />
                                                    ) : (
                                                        <IoMailUnread className="h-5 w-5" aria-hidden title="Unread" />
                                                    )}
                                                    <NotificationMessageModal notif={notif} />
                                                </td>
                                                <td
                                                    className={twMerge(
                                                        isLast ? "border-b border-neutral-200" : "",
                                                        "hidden whitespace-nowrap px-3 py-4 text-sm text-neutral-900 sm:table-cell",
                                                    )}>
                                                    {parseDate(notif.issuedAt)}
                                                </td>
                                                <td
                                                    className={twMerge(
                                                        isLast ? "border-b border-neutral-200" : "",
                                                        "flex gap-2 whitespace-nowrap py-4 pl-3 pr-4 text-sm text-neutral-900 sm:pr-6 lg:pr-8",
                                                    )}>
                                                    <Link
                                                        href={`/dashboard/${params.username}/notifications/${notif.id}?user=${notif.user.id}`}
                                                        className="font-semibold text-mourning-blue-600 hover:text-mourning-blue-700 active:text-mourning-blue-800">
                                                        View
                                                    </Link>
                                                    <NotificationDeleteModal notif={notif} />
                                                </td>
                                            </tr>
                                        )
                                    })}

                                {content.length < 1 && (
                                    <tr className="border-b border-neutral-300 bg-white">
                                        <td
                                            colSpan={6}
                                            className="py-4 pl-4 pr-3 text-sm font-bold text-neutral-900 sm:pl-6 lg:pl-8">
                                            No notifications found.
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
