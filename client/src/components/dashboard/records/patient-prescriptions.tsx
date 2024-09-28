"use client"

import { PaginatedSimplePrescriptions } from "@/interfaces/prescriptions"
import parseDate from "@/utils/parse-date"
import Link from "next/link"
import PatientNewPrescriptionButton from "@/components/dashboard/records/patient-new-prescription-button"
import { User } from "@/interfaces/users"
import { useUser } from "@/context/user-context-provider"

interface PatientPrescriptionsProps {
    prescriptionsPage: PaginatedSimplePrescriptions
    patient: User
}

export default function PatientPrescriptions({ prescriptionsPage, patient }: Readonly<PatientPrescriptionsProps>) {
    const userData = useUser()
    const baseUrl = "/dashboard/" + userData.user?.username + "/records/prescriptions"
    return (
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-between gap-2">
                <h2 className="text-base font-semibold leading-7 text-neutral-900">Recent Prescriptions</h2>
                <div className="flex flex-row-reverse items-center gap-2">
                    <PatientNewPrescriptionButton userId={patient.id} />
                    <Link
                        href={baseUrl + "?user=" + patient.id}
                        className="font-medium text-mourning-blue-600 hover:text-mourning-blue-700 active:text-mourning-blue-800">
                        List all
                    </Link>
                </div>
            </div>
            <ul className="mt-6 grid gap-4">
                {prescriptionsPage.content.length > 0 ? (
                    prescriptionsPage.content.map(prescription => (
                        <li
                            key={prescription.id}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-white p-2 hover:bg-neutral-100 sm:gap-0">
                            <div>
                                <h3 className="text-sm font-medium text-neutral-900">{prescription.doctor.fullName}</h3>
                                <p className="text-sm text-neutral-600">
                                    Issued at {parseDate(prescription.createdAt)}
                                </p>
                            </div>

                            <h3 className="text-sm font-medium text-neutral-900">
                                {prescription.patient.fullName ?? prescription.patient.username}
                            </h3>

                            <div className="flex gap-2">
                                <Link
                                    href={baseUrl + `/${prescription.id}/${prescription.patient.username}/edit`}
                                    className="font-medium text-mourning-blue-600 hover:text-mourning-blue-700 active:text-mourning-blue-800">
                                    Edit
                                </Link>
                                <Link
                                    href={baseUrl + `/${prescription.id}/${prescription.patient.username}/pdf`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-mourning-blue-600 hover:text-mourning-blue-700 active:text-mourning-blue-800">
                                    View/Print
                                </Link>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="relative mx-auto block w-full rounded-lg border border-dashed border-neutral-500 bg-white p-12 text-center text-sm text-neutral-600">
                        No Prescriptions Found
                    </li>
                )}
            </ul>
        </div>
    )
}
