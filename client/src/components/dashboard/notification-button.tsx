"use client"

import { useUser } from "@/context/user-context-provider"
import { useState } from "react"
import { FaBell } from "react-icons/fa6"
import { twMerge } from "tailwind-merge"
import { Button } from "@headlessui/react"

export default function NotificationButton() {
    const dataUser = useUser()
    const [isNotifDisabled, setIsNotifDisabled] = useState(!dataUser)

    if (!dataUser) setIsNotifDisabled(true)

    const totalNotifications = dataUser.user?.totalNotifications === undefined ? "X" : dataUser.user.totalNotifications
    const displayNotifications =
        typeof totalNotifications === "number" && totalNotifications > 99 ? "99+" : totalNotifications

    return (
        <div className="relative inline-flex w-fit">
            <div
                className={twMerge(
                    "absolute bottom-auto left-0 right-auto top-0 z-10 inline-block -translate-y-1/3 translate-x-2/4 rotate-0 skew-x-0 skew-y-0 scale-x-75 scale-y-75 select-none whitespace-nowrap rounded-full px-2.5 py-1 text-center align-baseline text-xs font-bold leading-none text-white",
                    isNotifDisabled || totalNotifications === 0 ? "bg-neutral-600" : "bg-hello-spring-600",
                )}>
                {displayNotifications}
            </div>
            <Button
                type="button"
                className="rounded-full bg-mourning-blue-800 p-1 text-neutral-400 hover:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
                disabled={isNotifDisabled}>
                <span className="sr-only">View notifications</span>
                <FaBell className="h-6 w-6" aria-hidden />
            </Button>
        </div>
    )
}
