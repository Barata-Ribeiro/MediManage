import { Prescription } from "@/interfaces/prescriptions"
import { MedicalRecord } from "@/interfaces/records"
import parseDate from "@/utils/parse-date"
import { FaPaperclip } from "react-icons/fa6"
import getAge from "@/utils/get-age"
import PrescriptionPdf from "@/components/prescription-pdf"
import { useEffect, useState } from "react"
import { pdf } from "@react-pdf/renderer"
import { twMerge } from "tailwind-merge"
import dynamic from "next/dynamic"
import Link from "next/link"
import { User } from "@/interfaces/users"

interface MedicalRecordAndPrescriptionProps {
    medicalRecord: MedicalRecord | object
    prescription: Prescription | object
    user: User
}

const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then(mod => mod.PDFDownloadLink), {
    ssr: false,
    loading: () => (
        <div role="status" className="w-full animate-pulse">
            <div className="h-4 w-52 rounded-full bg-mourning-blue-200">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    ),
})

export default function MedicalRecordAndPrescription({
    medicalRecord,
    prescription,
    user,
}: Readonly<MedicalRecordAndPrescriptionProps>) {
    const [blob, setBlob] = useState<Blob | null>(null)
    const [isDownloading, setIsDownloading] = useState(false)

    useEffect(() => {
        async function generateBlob() {
            setIsDownloading(true)

            try {
                const generatedBlob = await pdf(<PrescriptionPdf data={prescription as Prescription} />).toBlob()
                setBlob(generatedBlob)
            } catch (error) {
                console.error(error)
            } finally {
                setIsDownloading(false)
            }
        }

        generateBlob().catch(console.error)
    }, [prescription])

    if (Object.keys(medicalRecord).length === 0) return <p>No data</p>
    if (Object.keys(prescription).length === 0) return <p>No data</p>

    const medicalRecordData = medicalRecord as MedicalRecord
    const prescriptionData = prescription as Prescription
    const url = `/dashboard/${user.username}/prescriptions/`

    const fileName = `${prescriptionData.patient.username}_${new Date(prescriptionData.createdAt).toISOString()}_prescription.pdf`

    return (
        <div>
            <div className="px-4 sm:px-0">
                <h1 className="text-base font-semibold leading-7 text-neutral-900">Your Medical Record</h1>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-600">
                    Review your medical record and latest prescription.
                </p>
            </div>
            <div className="mt-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2">
                    <div className="border-t border-neutral-200 px-4 py-6 sm:col-span-1 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900">Full name</dt>
                        <dd className="mt-1 text-sm leading-6 text-neutral-700 sm:mt-2">
                            {medicalRecordData.patient.fullName ?? "Not Issued"}
                        </dd>
                    </div>
                    <div className="border-t border-neutral-200 px-4 py-6 sm:col-span-1 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900">Phone</dt>
                        <dd className="mt-1 text-sm leading-6 text-neutral-700 sm:mt-2">
                            {medicalRecordData.patient.phone}
                        </dd>
                    </div>
                    <div className="border-t border-neutral-200 px-4 py-6 sm:col-span-1 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900">Email address</dt>
                        <dd className="mt-1 text-sm leading-6 text-neutral-700 sm:mt-2">
                            {medicalRecordData.patient.email}
                        </dd>
                    </div>
                    <div className="border-t border-neutral-200 px-4 py-6 sm:col-span-1 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900">Birth Date</dt>
                        <dd className="mt-1 text-sm leading-6 text-neutral-700 sm:mt-2">
                            {parseDate(medicalRecordData.patient.birthDate)} (age:{" "}
                            {getAge(medicalRecordData.patient.birthDate)})
                        </dd>
                    </div>
                    <div className="border-t border-neutral-200 px-4 py-6 sm:col-span-1 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900">Address</dt>
                        <dd className="mt-1 text-sm leading-6 text-neutral-700 sm:mt-2">
                            {medicalRecordData.patient.address}
                        </dd>
                    </div>
                    <div className="border-t border-neutral-200 px-4 py-6 sm:col-span-1 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900">Insurance Company</dt>
                        <dd className="mt-1 flex flex-wrap items-center gap-2 text-sm leading-6 text-neutral-700 sm:mt-2">
                            <p>
                                <strong>Name:</strong> {medicalRecordData.insuranceCompany}
                            </p>
                            <p>
                                <strong>Member Id:</strong> {medicalRecordData.insuranceMemberIdNumber}
                            </p>
                            <p>
                                <strong>Group Number:</strong> {medicalRecordData.insuranceGroupNumber}
                            </p>
                            <p>
                                <strong>Policy Number:</strong> {medicalRecordData.insurancePolicyNumber}
                            </p>
                        </dd>
                    </div>
                    <div className="border-t border-neutral-200 px-4 py-6 sm:col-span-1 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900">Allergies</dt>
                        <dd className="mt-1 text-sm leading-6 text-neutral-700 sm:mt-2">
                            {medicalRecordData.allergies ?? "None"}
                        </dd>
                    </div>
                    <div className="border-t border-neutral-200 px-4 py-6 sm:col-span-1 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900">Medications</dt>
                        <dd className="mt-1 text-sm leading-6 text-neutral-700 sm:mt-2">
                            {medicalRecordData.medications ?? "None"}
                        </dd>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">Medical History</dt>
                        <dd className="mt-1 grid gap-2 text-sm leading-6 text-gray-700 sm:mt-2">
                            <p>
                                <strong>Personal medical history:</strong> {medicalRecordData.medicalHistory ?? "None"}
                            </p>
                            <p>
                                <strong>Family medical history:</strong>{" "}
                                {medicalRecordData.familyMedicalHistory ?? "None"}
                            </p>
                        </dd>
                    </div>
                    <div className="border-t border-neutral-200 px-4 pt-6 sm:col-span-2 sm:px-0">
                        <dt className="flex items-center gap-4">
                            <h2 className="text-base font-semibold leading-6 text-neutral-900">Latest Prescription</h2>
                            <Link
                                href={url}
                                className="text-sm font-medium leading-6 text-mourning-blue-600 hover:text-mourning-blue-700 active:text-mourning-blue-800">
                                List All
                            </Link>
                        </dt>
                        <dd className="mt-2 text-sm text-neutral-900">
                            <div className="divide-y divide-gray-100 rounded-md border border-neutral-200">
                                <div className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                    <div className="flex w-0 flex-1 items-center">
                                        {!isDownloading && blob ? (
                                            <>
                                                <FaPaperclip
                                                    aria-hidden="true"
                                                    className="h-5 w-5 flex-shrink-0 text-neutral-400"
                                                />
                                                <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                    <span className="truncate font-medium">{fileName}</span>
                                                    <span className="flex-shrink-0 text-neutral-400">
                                                        {(blob.size / 1024).toFixed(2)} KB
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <div role="status" className="w-full animate-pulse">
                                                <div className="h-4 w-full rounded-full bg-neutral-200">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                        <PDFDownloadLink
                                            document={<PrescriptionPdf data={prescriptionData} />}
                                            fileName={fileName}
                                            className={twMerge(
                                                "font-medium text-mourning-blue-600 hover:text-mourning-blue-700 active:text-mourning-blue-800",
                                                isDownloading && "cursor-default opacity-50",
                                            )}>
                                            {({ loading, error }) =>
                                                loading ? "Loading document..." : error ? "Error" : "Download"
                                            }
                                        </PDFDownloadLink>
                                    </div>
                                </div>
                            </div>
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    )
}
