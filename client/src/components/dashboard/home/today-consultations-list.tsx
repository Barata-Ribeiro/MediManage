import ConsultationTableRow from "@/components/dashboard/consultation-table-row"
import { Consultation } from "@/interfaces/consultations"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { FaPlus } from "react-icons/fa6"

interface TodayConsultationsListProps {
    data: Consultation[]
}

export default function TodayConsultationsList({ data }: Readonly<TodayConsultationsListProps>) {
    const { data: session } = useSession()
    return (
        <div className="rounded-md bg-white px-4 py-5 shadow sm:px-6">
            <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                <div className="ml-4 mt-2">
                    <h3 className="text-base font-semibold leading-6 text-neutral-900">List</h3>
                </div>
                <div className="ml-4 mt-2 flex-shrink-0">
                    <Link
                        href={`/dashboard/${session?.user?.username}/consultations/schedule`}
                        className="order-2 inline-flex w-max items-center gap-2 rounded-md bg-mourning-blue-600 px-3 py-2 text-center font-heading text-sm font-semibold text-white shadow-sm hover:bg-mourning-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mourning-blue-600 active:bg-mourning-blue-800 sm:order-1 sm:justify-self-end">
                        New Consultation <FaPlus className="inline-block" />
                    </Link>
                </div>
            </div>
            <div className="mt-4">
                <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-100">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600">
                                ID
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600">
                                Patient
                            </th>
                            <th
                                scope="col"
                                className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600 lg:table-cell">
                                Doctor
                            </th>
                            <th
                                scope="col"
                                className="w-max px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600">
                                Scheduled To
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 &&
                            data.map((consult, consultIdx) => (
                                <ConsultationTableRow
                                    key={consult.id}
                                    index={consultIdx}
                                    length={data.length}
                                    consult={consult}
                                />
                            ))}

                        {data.length < 1 && (
                            <tr className="border-b border-neutral-300 bg-white">
                                <td
                                    colSpan={6}
                                    className="py-4 pl-4 pr-3 text-sm font-bold text-neutral-900 sm:pl-6 lg:pl-8">
                                    No consultations for today.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
