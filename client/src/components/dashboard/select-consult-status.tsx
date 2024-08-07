"use client"

import { useState } from "react"
import { Button, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { FaChevronDown } from "react-icons/fa6"
import { twMerge } from "tailwind-merge"
import putUpdateConsultation from "@/actions/consultations/put-update-consultation"
import { Consultation } from "@/interfaces/consultations"

type ConsultStatus = "SCHEDULED" | "ACCEPTED" | "IN_PROGRESS" | "DONE" | "MISSED" | "CANCELLED"

interface SelectConsultStatusProps {
    id: number
    currentStatus: ConsultStatus
}

export default function SelectConsultStatus({ id, currentStatus }: Readonly<SelectConsultStatusProps>) {
    const [status, setStatus] = useState<ConsultStatus>(currentStatus)
    const [isPending, setIsPending] = useState(false)

    const statusList: ConsultStatus[] = ["SCHEDULED", "ACCEPTED", "IN_PROGRESS", "DONE", "MISSED", "CANCELLED"]
    const statusColor = {
        SCHEDULED: "text-neutral-600 bg-neutral-600/10",
        ACCEPTED: "text-green-600 bg-green-600/10",
        IN_PROGRESS: "text-blue-600 bg-blue-600/10",
        DONE: "text-green-600 bg-green-600/10",
        MISSED: "text-red-600 bg-red-600/10",
        CANCELLED: "text-red-600 bg-red-600/10",
    }

    async function handleStatusChange(option: string) {
        try {
            setIsPending(true)

            const state = await putUpdateConsultation(String(id), option, null)
            const consultation = state.response?.data as Consultation

            setStatus(consultation.status)
        } catch (error) {
            console.error(error)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <MenuButton
                    className="group inline-flex items-center justify-center text-sm font-medium text-neutral-800 hover:text-neutral-900 disabled:opacity-50"
                    disabled={isPending}>
                    <div className="inline-flex items-center gap-2">
                        <div aria-hidden="true" className={twMerge(statusColor[status], "flex-none rounded-full p-1")}>
                            <div className="h-1.5 w-1.5 rounded-full bg-current" />
                        </div>
                        <p className="hidden sm:block">
                            {status
                                .replace("_", " ")
                                .toLowerCase()
                                .replace(/^\w/, c => c.toUpperCase())}
                        </p>
                    </div>
                    <FaChevronDown
                        aria-hidden="true"
                        className="-mr-1 ml-1 h-3 w-3 flex-shrink-0 text-neutral-400 group-hover:text-neutral-500"
                    />
                </MenuButton>
            </div>

            <MenuItems
                transition
                className="absolute bottom-5 right-0 z-50 mt-2 w-40 origin-bottom-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                <div className="py-1">
                    {statusList.map(option => (
                        <MenuItem key={option}>
                            {({ focus }) => (
                                <Button
                                    onClick={() => handleStatusChange(option)}
                                    className={`${
                                        focus ? "bg-gray-100 text-neutral-900" : "text-neutral-700"
                                    } group flex w-full items-center px-2 py-2 text-sm`}>
                                    {option
                                        .replace("_", " ")
                                        .toLowerCase()
                                        .replace(/^\w/, c => c.toUpperCase())}
                                </Button>
                            )}
                        </MenuItem>
                    ))}
                </div>
            </MenuItems>
        </Menu>
    )
}
