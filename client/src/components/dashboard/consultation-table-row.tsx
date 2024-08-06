import type { Consultation } from "@/interfaces/consultations"
import { twMerge } from "tailwind-merge"
import SelectConsultStatus from "@/components/dashboard/select-consult-status"

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
                    "whitespace-nowrap py-4 pl-4 pr-3 font-body text-sm font-medium text-neutral-900 sm:pl-6 lg:pl-8",
                )}>
                {props.consult.id}
            </td>
            <td
                className={twMerge(
                    props.index !== props.length - 1 ? "border-b border-neutral-200" : "",
                    "hidden whitespace-nowrap px-3 py-4 font-body text-sm text-neutral-900 sm:table-cell",
                )}>
                {props.consult.patient.username}
            </td>
            <td
                className={twMerge(
                    props.index !== props.length - 1 ? "border-b border-neutral-200" : "",
                    "hidden whitespace-nowrap px-3 py-4 font-body text-sm text-neutral-900 sm:table-cell",
                )}>
                {props.consult.doctor.username}
            </td>
            <td
                className={twMerge(
                    props.index !== props.length - 1 ? "border-b border-neutral-200" : "",
                    "relative whitespace-nowrap py-4 pl-3 pr-4 text-right font-body text-sm font-medium sm:pr-8 lg:pr-8",
                )}>
                <time dateTime={props.consult.scheduledTo}>{props.consult.scheduledTo}</time>
            </td>
            <td
                className={twMerge(
                    props.index !== props.length - 1 ? "border-b border-neutral-200" : "",
                    "inline-flex items-center gap-2 whitespace-nowrap px-3 py-4 font-body text-sm text-neutral-900",
                )}>
                <SelectConsultStatus id={props.consult.id} currentStatus={props.consult.status} />
            </td>
        </tr>
    )
}
