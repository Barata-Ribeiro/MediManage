import SelectConsultDate from "@/components/dashboard/select-consult-date"
import SelectConsultStatus from "@/components/dashboard/select-consult-status"
import type { Consultation } from "@/interfaces/consultations"
import React from "react"
import { twMerge } from "tailwind-merge"

interface ConsultationTableRowProps {
    index: number
    length: number
    consult: Consultation
}

export default function ConsultationTableRow(props: Readonly<ConsultationTableRowProps>) {
    return (
        <tr className="border-b border-neutral-300 bg-white">
            <td
                className={twMerge(
                    props.index !== props.length - 1 ? "border-b border-neutral-200" : "",
                    "'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-700 sm:pl-6 lg:pl-8",
                )}>
                {props.consult.id}
            </td>
            <td
                className={twMerge(
                    props.index !== props.length - 1 ? "border-b border-neutral-200" : "",
                    "whitespace-nowrap px-3 py-4 text-sm text-neutral-700",
                )}>
                {props.consult.patient.fullName ?? props.consult.patient.username}
            </td>
            <td
                className={twMerge(
                    props.index !== props.length - 1 ? "border-b border-neutral-200" : "",
                    "hidden whitespace-nowrap px-3 py-4 text-sm text-neutral-700 lg:table-cell",
                )}>
                {props.consult.doctor.fullName ?? props.consult.doctor.username}
            </td>
            <td
                className={twMerge(
                    props.index !== props.length - 1 ? "border-b border-neutral-200" : "",
                    "w-max whitespace-nowrap px-3 py-4 text-sm text-neutral-700",
                )}>
                <SelectConsultDate id={props.consult.id} currentScheduledTo={props.consult?.scheduledTo} />
            </td>
            <td
                className={twMerge(
                    props.index !== props.length - 1 ? "border-b border-neutral-200" : "",
                    "whitespace-nowrap px-3 py-4 text-sm text-neutral-700",
                )}>
                <SelectConsultStatus id={props.consult.id} currentStatus={props.consult.status} />
            </td>
        </tr>
    )
}
