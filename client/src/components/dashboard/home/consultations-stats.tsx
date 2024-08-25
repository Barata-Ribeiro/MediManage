"use client"

type ConsultationValues = "missed" | "inProgress" | "scheduled" | "cancelled" | "accepted" | "done"

interface DoctorHomeProps {
    data: Record<ConsultationValues, number>
}

export default function ConsultationsStats({ data }: Readonly<DoctorHomeProps>) {
    const filteredData = Object.entries(data).filter(([status]) => status !== "accepted" && status !== "inProgress")

    const totalConsultations = filteredData.reduce((acc, [, consultations]) => acc + consultations, 0)

    return (
        <div>
            <h3 className="text-lg font-semibold leading-6 text-neutral-900">Consultations</h3>
            <dl className="mt-5 grid grid-cols-1 divide-y divide-neutral-200 overflow-hidden rounded-md bg-white shadow md:grid-cols-4 md:divide-x md:divide-y-0">
                {filteredData.map(([status, consultations]) => (
                    <div key={status} className="px-4 py-5 sm:p-6">
                        <dt className="font-heading text-base font-medium capitalize text-neutral-800">{status}</dt>
                        <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                            <div className="flex items-baseline text-2xl font-semibold text-mourning-blue-500">
                                {consultations}
                                <span className="ml-2 text-sm font-medium text-neutral-600">
                                    {((consultations / totalConsultations) * 100).toFixed(2)}% from total
                                </span>
                            </div>
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}
