"use client"

import { useUser } from "@/context/user-context-provider"
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import NotificationMenu from "@/components/dashboard/notification-menu"

export default function NotificationButton() {
    const dataUser = useUser()
    const [isNotifDisabled, setIsNotifDisabled] = useState(!dataUser)

    if (!dataUser) setIsNotifDisabled(true)

    const totalUnreadNotifications =
        dataUser.user?.totalUnreadNotifications === undefined ? "X" : dataUser.user.totalUnreadNotifications
    const displayNotifications =
        typeof totalUnreadNotifications === "number" && totalUnreadNotifications > 99 ? "99+" : totalUnreadNotifications

    return (
        <div className="relative inline-flex w-fit">
            <div
                className={twMerge(
                    "absolute bottom-auto left-0 right-auto top-0 z-10 inline-block -translate-y-1/3 translate-x-1.5 rotate-0 skew-x-0 skew-y-0 scale-x-75 scale-y-75 select-none whitespace-nowrap rounded-full px-2.5 py-1 text-center align-baseline text-xs font-bold leading-none text-white",
                    isNotifDisabled || totalUnreadNotifications === 0 ? "bg-neutral-600" : "bg-hello-spring-600",
                )}>
                {displayNotifications}
            </div>
            <NotificationMenu disabled={isNotifDisabled} />
        </div>
    )
}
