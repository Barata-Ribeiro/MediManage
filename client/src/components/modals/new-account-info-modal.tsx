"use client"

import NewUserCredentialsPdf from "@/components/new-user-credentials-pdf"
import { useUser } from "@/context/user-context-provider"
import { NewAccountResponse } from "@/interfaces/auth"
import parseDate from "@/utils/parse-date"
import { Button, Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { usePDF } from "@react-pdf/renderer"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaCheck } from "react-icons/fa6"

interface NewAccountInfoModalProps {
    data: NewAccountResponse | null
    showModal: boolean
}

export default function NewAccountInfoModal({ data, showModal }: Readonly<NewAccountInfoModalProps>) {
    const [open, setOpen] = useState(showModal)
    const [instance, updateInstance] = usePDF({ document: <NewUserCredentialsPdf data={data!} /> })

    useEffect(() => {
        if (data) updateInstance(<NewUserCredentialsPdf data={data!} />)
    }, [data, updateInstance])

    const context = useUser()

    const router = useRouter()

    function handleClose() {
        const url = `/dashboard/${context.user?.username}`
        setOpen(false)
        router.replace(url)
    }

    const filename = `new-account-credentials-${data?.username}_${new Date(
        data?.registeredAt ?? new Date(),
    ).toISOString()}.pdf`

    return (
        <Dialog open={open} onClose={handleClose} className="relative z-10">
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
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-hello-spring-100">
                                <FaCheck aria-hidden="true" className="h-6 w-6 text-hello-spring-600" />
                            </div>
                            <div className="mt-3 text-center sm:mt-5">
                                <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-neutral-900">
                                    Account Created Successfully
                                </DialogTitle>
                                <Description className="mt-2 text-base text-neutral-700">
                                    The account has been created successfully. Instruct the user on how to access the
                                    system and to change their password after logging in. The login credentials are as
                                    follows:
                                </Description>
                                <div className="mt-2 grid gap-2 rounded-lg border-2 border-dashed border-hello-spring-400 bg-hello-spring-100 p-12 text-center">
                                    <dl className="mt-2 grid gap-2">
                                        <div className="inline-flex gap-2">
                                            <dt className="text-sm font-semibold text-neutral-900">Username:</dt>
                                            <dd className="text-sm text-neutral-800">{data?.username}</dd>
                                        </div>
                                        <div className="inline-flex gap-2">
                                            <dt className="text-sm font-semibold text-neutral-900">Password:</dt>
                                            <dd className="text-sm text-neutral-800">{data?.password}</dd>
                                        </div>
                                        <div className="inline-flex gap-2">
                                            <dt className="text-sm font-semibold text-neutral-900">Registered At:</dt>
                                            <dd className="text-sm text-neutral-800">
                                                {parseDate(data?.registeredAt)}
                                            </dd>
                                        </div>
                                        <div className="inline-flex gap-2">
                                            <dt className="text-sm font-semibold text-neutral-900">Warning:</dt>
                                            <dd className="text-sm text-neutral-800">{data?.message}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                            <Link
                                href={instance.url ?? "#"}
                                download={filename}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Print Credentials"
                                className="inline-flex w-full justify-center rounded-md bg-mourning-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-mourning-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mourning-blue-600 active:bg-mourning-blue-800 sm:col-start-2">
                                Print Credentials
                            </Link>
                            <Button
                                type="button"
                                onClick={handleClose}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 sm:col-start-1 sm:mt-0">
                                Go to Dashboard
                            </Button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
