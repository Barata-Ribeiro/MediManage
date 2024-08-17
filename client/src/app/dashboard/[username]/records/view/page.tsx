import { notFound } from "next/navigation"
import { RecordsPageProps } from "@/app/dashboard/[username]/records/page"
import { Metadata } from "next"
import getRecordById from "@/actions/records/get-record-by-id"
import { MedicalRecord } from "@/interfaces/records"
import PatientMedicalRecords from "@/components/dashboard/records/patient-medical-records"
import PatientConsultations from "@/components/dashboard/records/patient-consultations"
import PatientPrescriptions from "@/components/dashboard/records/patient-prescriptions"
import getAllPatientConsultationsPaginated from "@/actions/consultations/get-all-patient-consultations-paginated"
import { PaginatedConsultations } from "@/interfaces/consultations"
import getAllPatientPrescriptionsPaginated from "@/actions/prescriptions/get-all-patient-prescriptions-paginated"
import { PaginatedSimplePrescriptions } from "@/interfaces/prescriptions"

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

    const [recordState, consultationsState, prescriptionState] = await Promise.all([
        await getRecordById(searchParams.id.toString()),
        await getAllPatientConsultationsPaginated(searchParams.user.toString()),
        await getAllPatientPrescriptionsPaginated(searchParams.user.toString()),
    ])

    const record = recordState.response?.data as MedicalRecord
    const consultations = consultationsState.response?.data as PaginatedConsultations
    const prescriptions = prescriptionState.response?.data as PaginatedSimplePrescriptions

    const displayName = record.patient.fullName ?? record.patient.username

    return (
        <div className="space-y-4 divide-y divide-neutral-200">
            <PatientMedicalRecords displayName={displayName} record={record} />
            <div className="w-full xl:flex">
                <PatientConsultations consultationsPage={consultations} patient={record.patient} />
                <PatientPrescriptions prescriptionsPage={prescriptions} patient={record.patient} />
            </div>
        </div>
    )
}
