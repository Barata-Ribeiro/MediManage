import { useUser } from "@/context/user-context-provider"
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"
import { FaBell } from "react-icons/fa6"
import { Fragment, useEffect, useState } from "react"
import getLatestUserNotifications from "@/actions/notifications/get-latest-user-notifications"
import { Notification } from "@/interfaces/notifications"
import Link from "next/link"
import { twMerge } from "tailwind-merge"
import RequisitionError from "@/components/helpers/requisition-error"
import { ProblemDetails } from "@/interfaces/actions"
import { ZodIssue } from "zod"
import parseDate from "@/utils/parse-date"
import { FaCheckSquare } from "react-icons/fa"

type StateError = string | ProblemDetails | Partial<Pick<ZodIssue, "path" | "message">>[]

export default function NotificationMenu({ disabled }: Readonly<{ disabled: boolean }>) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<StateError | null>(null)
    const dataUser = useUser()

    const url = "/dashboard/" + dataUser.user?.username + "/notifications"

    useEffect(() => {
        if (dataUser.user) {
            setLoading(true)
            getLatestUserNotifications(dataUser.user.id)
                .then(state => {
                    if (state.ok) setNotifications(state.response?.data as Notification[])
                    else setError(state.error)
                })
                .catch(error => setError(error))
                .finally(() => setLoading(false))
        }
    }, [dataUser])

    return (
        <Menu as="div" className="relative ml-3">
            <div>
                <MenuButton
                    className="rounded-full bg-mourning-blue-800 p-1 text-neutral-400 hover:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-default disabled:opacity-50"
                    disabled={disabled ?? loading}>
                    <span className="sr-only">View notifications</span>
                    <FaBell className="h-6 w-6" aria-hidden />
                </MenuButton>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <MenuItems className="absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-md bg-neutral-50 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {error && (
                        <MenuItem as="div" disabled>
                            <RequisitionError error={error as string | ProblemDetails} />
                        </MenuItem>
                    )}
                    {!loading && !error && notifications.length === 0 && (
                        <MenuItem
                            as="p"
                            className="px-2 py-8 text-center font-heading text-sm text-neutral-600"
                            disabled>
                            No notifications available
                        </MenuItem>
                    )}
                    {!loading &&
                        !error &&
                        notifications.map((notification, index) => (
                            <MenuItem key={notification.id + "_" + index}>
                                {({ focus }) => (
                                    <div className="inline-flex items-start gap-2 px-8 py-2">
                                        <div className="flex-shrink-0">
                                            <FaCheckSquare
                                                aria-hidden
                                                className={twMerge(
                                                    "h-5 w-5",
                                                    !notification.isRead ? "text-hello-spring-500" : "text-neutral-500",
                                                )}
                                            />
                                        </div>
                                        <Link
                                            className="grid text-sm text-neutral-700"
                                            href={url + "/" + notification.id}>
                                            <h3
                                                className={twMerge(
                                                    "font-heading text-sm font-medium leading-5 tracking-wide transition-all",
                                                    focus ? "underline underline-offset-2" : "",
                                                )}>
                                                {notification.title}
                                            </h3>
                                            <p className="text-sm">
                                                Sent on{" "}
                                                <time dateTime={notification.issuedAt}>
                                                    {parseDate(notification.issuedAt)}
                                                </time>
                                            </p>
                                        </Link>
                                    </div>
                                )}
                            </MenuItem>
                        ))}
                    <MenuItem as="div" className="-mb-2 flex h-full w-full rounded-b-md">
                        <Link
                            href={url}
                            className="w-full rounded-b-md bg-mourning-blue-600 py-2 text-center font-heading text-sm font-medium leading-7 tracking-wide text-neutral-50 hover:bg-mourning-blue-700 active:bg-mourning-blue-800">
                            See All Notifications ({dataUser.user?.totalNotifications})
                        </Link>
                    </MenuItem>
                </MenuItems>
            </Transition>
        </Menu>
    )
}
