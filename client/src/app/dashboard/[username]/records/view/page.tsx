import { notFound } from "next/navigation"
import { RecordsPageProps } from "@/app/dashboard/[username]/records/page"
import { Metadata } from "next"
import getRecordById from "@/actions/records/get-record-by-id"
import { MedicalRecord } from "@/interfaces/records"
import PatientMedicalRecords from "@/components/dashboard/records/PatientMedicalRecords"
import PatientConsultations from "@/components/dashboard/records/PatientConsultations"
import PatientPrescriptions from "@/components/dashboard/records/PatientPrescriptions"
import getAllPatientConsultationsPaginated from "@/actions/consultations/get-all-patient-consultations-paginated"
import { PaginatedConsultations } from "@/interfaces/consultations"

export async function generateMetadata({ searchParams }: Readonly<RecordsPageProps>): Promise<Metadata> {
    if (!searchParams?.id || !searchParams?.user) return notFound()

    const state = await getRecordById(searchParams.id.toString())
    const record = state.response?.data as MedicalRecord

    const displayName = record.patient.fullName ?? record.patient.username

    return {
        title: "Record details of " + displayName,
        description: "These are the details of the medical record of " + displayName + ".",
    }
}

export default async function ViewMedicalRecordsPage({ params, searchParams }: Readonly<RecordsPageProps>) {
    if (!params.username || !searchParams?.id || !searchParams?.user) return notFound()

    const [recordState, consultationsState] = await Promise.all([
        await getRecordById(searchParams.id.toString()),
        await getAllPatientConsultationsPaginated(searchParams.user.toString()),
    ])

    const record = recordState.response?.data as MedicalRecord
    const consultations = consultationsState.response?.data as PaginatedConsultations

    const displayName = record.patient.fullName ?? record.patient.username

    return (
        <div className="space-y-4 divide-y divide-neutral-200">
            <PatientMedicalRecords displayName={displayName} record={record} />
            <div className="w-full xl:flex">
                <PatientConsultations consultationsPage={consultations} />
                <PatientPrescriptions />
            </div>
        </div>
    )
}
