import { PaginatedSimplePrescriptions } from "@/interfaces/prescriptions"
import parseDate from "@/utils/parse-date"
import Link from "next/link"
import PatientNewPrescriptionButton from "@/components/dashboard/records/patient-new-prescription-button"
import { User } from "@/interfaces/users"

interface PatientPrescriptionsProps {
    prescriptionsPage: PaginatedSimplePrescriptions
    patient: User
}

export default function PatientPrescriptions({ prescriptionsPage, patient }: Readonly<PatientPrescriptionsProps>) {
    return (
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-between gap-2">
                <h2 className="text-base font-semibold leading-7 text-neutral-900">Recent Prescriptions</h2>
                <PatientNewPrescriptionButton userId={patient.id} />
            </div>
            <ul className="mt-6 grid gap-4">
                {prescriptionsPage.content.length > 0 ? (
                    prescriptionsPage.content.map(prescription => (
                        <li
                            key={prescription.id}
                            className="flex items-center justify-between rounded-md border bg-white p-2 hover:bg-neutral-100">
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
                                    href="#"
                                    className="font-heading font-medium text-mourning-blue-600 hover:text-mourning-blue-700 active:text-mourning-blue-800">
                                    View
                                </Link>
                                <Link
                                    href="#"
                                    className="font-heading font-medium text-mourning-blue-600 hover:text-mourning-blue-700 active:text-mourning-blue-800">
                                    Edit
                                </Link>
                                <Link
                                    href="#"
                                    className="font-heading font-medium text-mourning-blue-600 hover:text-mourning-blue-700 active:text-mourning-blue-800">
                                    Print
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
