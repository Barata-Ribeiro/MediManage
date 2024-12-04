"use client"

import { ProblemDetails } from "@/interfaces/actions"
import { Transition } from "@headlessui/react"
import { useState } from "react"
import { FaTriangleExclamation, FaX } from "react-icons/fa6"

interface NotificationProps {
    error: string | ProblemDetails
}

export default function SimpleErrorNotification({ error }: Readonly<NotificationProps>) {
    const [show, setShow] = useState(true)
    const isStringError = typeof error === "string"
    return (
        <>
            {/* Global notification live region */}
            <div
                aria-live="assertive"
                className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6">
                <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                    {/* Notification panel */}
                    <Transition
                        show={show}
                        enter="transform ease-out duration-300 transition"
                        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-derek ring-1 ring-black ring-opacity-5">
                            <div className="p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <FaTriangleExclamation className="h-6 w-6 text-yellow-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3 w-0 flex-1 pt-0.5">
                                        {isStringError ? (
                                            <>
                                                <p className="text-sm font-medium text-gray-900">An error occurred</p>
                                                <p className="mt-1 text-sm text-gray-500">{error}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-sm font-medium text-gray-900">
                                                    <span className="font-bold">{error.status}</span> - {error.title}
                                                </p>
                                                <p className="mt-1 text-sm text-gray-500">{error.detail}</p>
                                                {error["invalid-params"] && (
                                                    <ul className="mt-2 list-disc space-y-1 pl-5">
                                                        {error["invalid-params"].map(
                                                            (param: { fieldName: string; reason: string }) => (
                                                                <li key={param.fieldName}>{param.reason}</li>
                                                            ),
                                                        )}
                                                    </ul>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div className="ml-4 flex flex-shrink-0">
                                        <button
                                            type="button"
                                            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            onClick={() => {
                                                setShow(false)
                                            }}>
                                            <span className="sr-only">Close</span>
                                            <FaX className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </>
    )
}
