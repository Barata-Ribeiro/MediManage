"use client"

import deleteUserNotification from "@/actions/notifications/delete-user-notification"
import RequisitionError from "@/components/helpers/requisition-error"
import Spinner from "@/components/helpers/spinner"
import { ProblemDetails } from "@/interfaces/actions"
import { Notification } from "@/interfaces/notifications"
import { Button, Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaExclamationTriangle } from "react-icons/fa"
import { ZodIssue } from "zod"

interface NotifDeleteModalProps {
    notif: Notification
}

type StateError = string | ProblemDetails | Partial<Pick<ZodIssue, "path" | "message">>[]

export default function NotifDeleteModal({ notif }: Readonly<NotifDeleteModalProps>) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<StateError | null>(null)

    const router = useRouter()

    const { data: session } = useSession()

    async function handleNotifDeletion() {
        setLoading(true)

        try {
            if (!session?.user) return

            const state = await deleteUserNotification({
                userId: session.user.id,
                notifId: notif.id.toString(),
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
            <Button
                type="button"
                onClick={() => setOpen(true)}
                className="font-semibold text-red-600 hover:text-red-700 active:text-red-800">
                Delete
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
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <FaExclamationTriangle aria-hidden="true" className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-neutral-900">
                                        Delete Notification
                                    </DialogTitle>
                                    <Description className="prose my-2 text-base text-neutral-700">
                                        You are about to delete the notification {notif.id} &ldquo;
                                        <strong>{notif.title}</strong>
                                        {/* */}
                                        &rdquo; Are you sure you want to delete this notification? This action cannot be
                                        undone.
                                    </Description>
                                </div>
                            </div>

                            {error && !Array.isArray(error) && <RequisitionError error={error} />}

                            <div className="mt-3 sm:mt-4 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                <Button
                                    type="button"
                                    onClick={handleNotifDeletion}
                                    disabled={loading}
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 active:bg-red-800 disabled:cursor-default disabled:opacity-50 sm:col-start-2">
                                    {loading ? (
                                        <>
                                            <Spinner /> Loading...
                                        </>
                                    ) : (
                                        "Delete"
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    data-autofocus={true}
                                    onClick={() => setOpen(false)}
                                    disabled={loading}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 active:bg-neutral-200 sm:col-start-1 sm:mt-0">
                                    Cancel
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
