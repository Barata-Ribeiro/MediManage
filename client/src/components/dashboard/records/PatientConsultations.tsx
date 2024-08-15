import { PaginatedConsultations } from "@/interfaces/consultations"
import parseDate from "@/utils/parse-date"

interface PatientConsultationsProps {
    consultationsPage: PaginatedConsultations
}

export default function PatientConsultations({ consultationsPage }: Readonly<PatientConsultationsProps>) {
    return (
        <aside className="hidden w-1/3 border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
            <h2 className="text-base font-semibold leading-7 text-neutral-900">Recent Consultations</h2>
            <div className="mt-6 space-y-6">
                {consultationsPage ? (
                    consultationsPage.content.map(consultation => (
                        <div
                            key={consultation.id}
                            className="flex items-center justify-between rounded-md border bg-white p-2">
                            <div>
                                <h3 className="text-sm font-medium text-neutral-900">{consultation.doctor.fullName}</h3>
                                <p className="text-sm text-neutral-600">{parseDate(consultation.updatedAt)}</p>
                            </div>
                            {(() => {
                                switch (consultation.status) {
                                    case "SCHEDULED":
                                        return (
                                            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-neutral-600 ring-1 ring-inset ring-neutral-500/10">
                                                Scheduled
                                            </span>
                                        )
                                    case "ACCEPTED":
                                        return (
                                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                Accepted
                                            </span>
                                        )
                                    case "IN_PROGRESS":
                                        return (
                                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                In Progress
                                            </span>
                                        )
                                    case "DONE":
                                        return (
                                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                Done
                                            </span>
                                        )
                                    case "MISSED":
                                        return (
                                            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                                Missed
                                            </span>
                                        )
                                    case "CANCELLED":
                                        return (
                                            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                                Cancelled
                                            </span>
                                        )
                                    default:
                                        return (
                                            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-neutral-600 ring-1 ring-inset ring-neutral-500/10">
                                                Unknown
                                            </span>
                                        )
                                }
                            })()}
                        </div>
                    ))
                ) : (
                    <p className="relative mx-auto block w-full rounded-lg border border-dashed border-neutral-500 bg-white p-12 text-center text-sm text-neutral-600">
                        No consultations found
                    </p>
                )}
            </div>
        </aside>
    )
}
