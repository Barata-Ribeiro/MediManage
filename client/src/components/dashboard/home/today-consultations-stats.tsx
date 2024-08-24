"use client"

type ConsultationValues =
    | "totalConsultations"
    | "missed"
    | "inProgress"
    | "scheduled"
    | "cancelled"
    | "accepted"
    | "done"

interface TodayConsultationsStatsProps {
    data: Record<ConsultationValues, number>
    totalData: Record<ConsultationValues, number>
}

export default function TodayConsultationsStats({ data, totalData }: Readonly<TodayConsultationsStatsProps>) {
    const todayConsultations = Object.entries(data).filter(([status]) => status !== "totalConsultations")

    const totalConsultationsToday = data.totalConsultations
    const totalConsultationsOverall = Object.values(totalData).reduce((acc, consultations) => acc + consultations, 0)

    return (
        <div>
            <h3 className="text-lg font-semibold leading-6 text-neutral-900">Today&apos;s Consultations</h3>
            <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow md:grid-cols-3 md:divide-y-0">
                {todayConsultations.map(([status, consultations]) => (
                    <div key={status} className="px-4 py-5 sm:p-6">
                        <dt className="font-heading text-base font-medium capitalize text-neutral-800">
                            {status === "inProgress" ? "in progress" : status}
                        </dt>
                        <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                            <div className="flex items-baseline text-2xl font-semibold text-mourning-blue-500">
                                {consultations}
                                <span className="ml-2 text-sm font-medium text-neutral-600">
                                    {totalConsultationsToday > 0
                                        ? ((consultations / totalConsultationsToday) * 100).toFixed(2)
                                        : 0}
                                    % from today&apos;s total
                                </span>
                                <span className="ml-2 text-sm font-medium text-neutral-500">
                                    {totalConsultationsOverall > 0
                                        ? ((consultations / totalConsultationsOverall) * 100).toFixed(2)
                                        : 0}
                                    % from overall total
                                </span>
                            </div>
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}
