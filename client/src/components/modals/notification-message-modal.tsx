"use client"

import patchChangeNotificationStatus from "@/actions/notifications/patch-change-notification-status"
import RequisitionError from "@/components/helpers/requisition-error"
import Spinner from "@/components/helpers/spinner"
import { useUser } from "@/context/user-context-provider"
import { ProblemDetails } from "@/interfaces/actions"
import { Notification } from "@/interfaces/notifications"
import { Button, Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { IoMail } from "react-icons/io5"
import { ZodIssue } from "zod"

interface NotificationMessageProps {
    notif: Notification
}

type StateError = string | ProblemDetails | Partial<Pick<ZodIssue, "path" | "message">>[]

export default function NotificationMessageModal({ notif }: Readonly<NotificationMessageProps>) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<StateError | null>(null)

    const router = useRouter()

    const { user } = useUser()
    if (!user) return null

    const isRead = notif.isRead
    const buttonAction = isRead ? "unread" : "read"

    async function handleReadStatus() {
        setLoading(true)

        try {
            if (!user) return

            const state = await patchChangeNotificationStatus({
                userId: user.id,
                notifId: notif.id.toString(),
                currentStatus: isRead.toString(),
            })

            if (!state.ok) setError(state.error)
            else {
                setOpen(false)
                router.refresh()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button type="button" onClick={() => setOpen(true)}>
                {notif.title}
            </Button>
            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-neutral-800 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
                            <div>
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mourning-blue-100">
                                    <IoMail aria-hidden className="h-6 w-6 text-mourning-blue-300" />
                                </div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <DialogTitle
                                        as="h3"
                                        className="font-heading text-lg font-semibold leading-6 text-neutral-900">
                                        {notif.title}
                                    </DialogTitle>
                                    <Description className="prose my-2 text-base text-neutral-700">
                                        {notif.message}
                                    </Description>
                                </div>
                            </div>

                            {error && !Array.isArray(error) && <RequisitionError error={error} />}

                            <div className="mt-3 sm:mt-4 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                <Button
                                    type="button"
                                    onClick={handleReadStatus}
                                    disabled={loading}
                                    className="inline-flex w-full justify-center rounded-md bg-mourning-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-mourning-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mourning-blue-600 active:bg-mourning-blue-800 disabled:cursor-default disabled:opacity-50 sm:col-start-2">
                                    {loading ? (
                                        <>
                                            <Spinner /> Loading...
                                        </>
                                    ) : (
                                        "Mark as " + buttonAction
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    data-autofocus={true}
                                    onClick={() => setOpen(false)}
                                    disabled={loading}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 active:bg-neutral-200 sm:col-start-1 sm:mt-0">
                                    Close
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
