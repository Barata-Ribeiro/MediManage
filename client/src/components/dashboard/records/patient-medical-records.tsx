import { MedicalRecord } from "@/interfaces/records"
import parseDate from "@/utils/parse-date"
import Link from "next/link"

interface PatientMedicalRecordsProps {
    displayName: string
    record: MedicalRecord
}

export default function PatientMedicalRecords({ displayName, record }: Readonly<PatientMedicalRecordsProps>) {
    return (
        <article>
            <div className="flex-auto">
                <h1 className="text-xl font-bold leading-6 text-neutral-900">Medical Record</h1>
                <p className="mt-2 max-w-xl text-sm text-neutral-700">
                    These are the medical records informations for {displayName}.
                </p>
            </div>

            <div className="mt-6 border-t border-neutral-200 py-4 sm:p-4">
                <h2 className="text-base font-semibold leading-6 text-neutral-900">Patient</h2>
                <dl className="mt-6 gap-6 space-y-4 sm:grid sm:grid-cols-2 sm:space-y-0 lg:grid-cols-3">
                    <div className="grid grid-cols-2 items-start">
                        <dt className="text-sm font-semibold leading-5 text-neutral-600">Full name</dt>
                        <dd className="text-sm leading-5 text-neutral-900">{record.patient.fullName ?? "Empty"}</dd>
                    </div>
                    <div className="grid grid-cols-2 items-start">
                        <dt className="text-sm font-semibold leading-5 text-neutral-600">Username</dt>
                        <dd className="text-sm leading-5 text-neutral-900">{record.patient.username}</dd>
                    </div>
                    <div className="grid grid-cols-2 items-start">
                        <dt className="text-sm font-semibold leading-5 text-neutral-600">Email</dt>
                        <dd className="text-sm leading-5 text-neutral-900">
                            <Link href={`mailto:${record.patient.email}`}>{record.patient.email}</Link>
                        </dd>
                    </div>
                    <div className="grid grid-cols-2 items-start">
                        <dt className="text-sm font-semibold leading-5 text-neutral-600">Phone</dt>
                        <dd className="text-sm leading-5 text-neutral-900">
                            {(record.patient.phone && (
                                <Link href={`tel:${record.patient.phone}`}>{record.patient.phone}</Link>
                            )) ??
                                "Empty"}
                        </dd>
                    </div>
                    <div className="grid grid-cols-2 items-start">
                        <dt className="text-sm font-semibold leading-5 text-neutral-600">Address</dt>
                        <dd className="text-sm leading-5 text-neutral-900">{record.patient.address ?? "Empty"}</dd>
                    </div>
                    <div className="grid grid-cols-2 items-start">
                        <dt className="text-sm font-semibold leading-5 text-neutral-600">Birth Date</dt>
                        <dd className="text-sm leading-5 text-neutral-900">
                            {(record.patient.birthDate && parseDate(record.patient.birthDate)) ?? "Empty"}
                        </dd>
                    </div>
                </dl>
            </div>

            <div className="mt-6 border-t border-neutral-200 py-4 sm:p-4">
                <h2 className="text-base font-semibold leading-6 text-neutral-900">Insurance Information</h2>
                <dl className="mt-6 gap-6 space-y-4 sm:grid sm:grid-cols-2 sm:space-y-0">
                    <div className="grid grid-cols-2 items-start">
                        <dt className="text-sm font-semibold leading-5 text-neutral-600">Company</dt>
                        <dd className="text-sm leading-5 text-neutral-900">{record.insuranceCompany}</dd>
                    </div>
                    <div className="grid grid-cols-2 items-start">
                        <dt className="text-sm font-semibold leading-5 text-neutral-600">Member ID</dt>
                        <dd className="text-sm leading-5 text-neutral-900">{record.insuranceMemberIdNumber}</dd>
                    </div>
                    <div className="grid grid-cols-2 items-start">
                        <dt className="text-sm font-semibold leading-5 text-neutral-600">Group Number</dt>
                        <dd className="text-sm leading-5 text-neutral-900">{record.insuranceGroupNumber}</dd>
                    </div>
                    <div className="grid grid-cols-2 items-start">
                        <dt className="text-sm font-semibold leading-5 text-neutral-600">Policy Number</dt>
                        <dd className="text-sm leading-5 text-neutral-900">{record.insurancePolicyNumber}</dd>
                    </div>
                </dl>
            </div>

            <div className="mt-6 border-t border-neutral-200 py-4 sm:p-4">
                <h2 className="text-base font-semibold leading-6 text-neutral-900">Medical Information</h2>
                <dl className="mt-6 gap-6 space-y-4 sm:grid sm:grid-cols-2 sm:space-y-0">
                    <div className="grid grid-cols-2 items-start">
                        <dt className="text-sm font-semibold leading-5 text-neutral-600">Allergies</dt>
                        <dd className="text-sm leading-5 text-neutral-900">{record.allergies ?? "Empty"}</dd>
                    </div>
                    <div className="grid grid-cols-2 items-start">
                        <dt className="text-sm font-semibold leading-5 text-neutral-600">Medications</dt>
                        <dd className="text-sm leading-5 text-neutral-900">{record.medications ?? "Empty"}</dd>
                    </div>
                    <div className="grid grid-cols-2 items-start">
                        <dt className="text-sm font-semibold leading-5 text-neutral-600">Medical History</dt>
                        <dd className="text-sm leading-5 text-neutral-900">{record.medicalHistory ?? "Empty"}</dd>
                    </div>
                    <div className="grid grid-cols-2 items-start">
                        <dt className="text-sm font-semibold leading-5 text-neutral-600">Family Medical History</dt>
                        <dd className="text-sm leading-5 text-neutral-900">{record.familyMedicalHistory ?? "Empty"}</dd>
                    </div>
                </dl>
            </div>
        </article>
    )
}
