import getAllPatientConsultationsPaginated from "@/actions/consultations/get-all-patient-consultations-paginated"
import getAllPatientPrescriptionsPaginated from "@/actions/prescriptions/get-all-patient-prescriptions-paginated"
import getRecordById from "@/actions/records/get-record-by-id"
import { RecordsPageProps } from "@/app/dashboard/[username]/records/page"
import PatientConsultations from "@/components/dashboard/records/patient-consultations"
import PatientMedicalRecords from "@/components/dashboard/records/patient-medical-records"
import PatientPrescriptions from "@/components/dashboard/records/patient-prescriptions"
import StateError from "@/components/helpers/state-error"
import { ProblemDetails } from "@/interfaces/actions"
import { PaginatedConsultations } from "@/interfaces/consultations"
import { PaginatedSimplePrescriptions } from "@/interfaces/prescriptions"
import { MedicalRecord } from "@/interfaces/records"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export async function generateMetadata({ searchParams }: Readonly<RecordsPageProps>): Promise<Metadata> {
    if (!searchParams?.id || !searchParams?.user) return notFound()

    const state = await getRecordById(searchParams.id.toString())
    if (!state.ok) {
        return {
            title: (state.error as ProblemDetails).status + " - " + (state.error as ProblemDetails).title,
            description: (state.error as ProblemDetails).detail,
        }
    }
    const record = state.response?.data as MedicalRecord

    const displayName = record.patient.fullName ?? record.patient.username

    return {
        title: "Record details of " + displayName,
        description: "These are the details of the medical record of " + displayName + ".",
    }
}

export default async function ViewMedicalRecordsPage({ params, searchParams }: Readonly<RecordsPageProps>) {
    if (!params.username || !searchParams?.id || !searchParams?.user) return notFound()

    const recordStatePromise = getRecordById(searchParams.id.toString())
    const consultationsStatePromise = getAllPatientConsultationsPaginated(searchParams.user.toString())
    const prescriptionStatePromise = getAllPatientPrescriptionsPaginated(searchParams.user.toString())

    const [recordState, consultationsState, prescriptionState] = await Promise.all([
        recordStatePromise,
        consultationsStatePromise,
        prescriptionStatePromise,
    ])

    if (!recordState.ok || !consultationsState.ok || !prescriptionState.ok) {
        const error = (recordState.error ?? consultationsState.error ?? prescriptionState.error) as ProblemDetails
        return <StateError error={error} />
    }

    const record = recordState.response?.data as MedicalRecord
    const consultations = consultationsState.response?.data as PaginatedConsultations
    const prescriptions = prescriptionState.response?.data as PaginatedSimplePrescriptions

    const displayName = record.patient.fullName ?? record.patient.username

    return (
        <section id="view-medical-records-section" className="space-y-4 divide-y divide-neutral-200">
            <PatientMedicalRecords displayName={displayName} record={record} />
            <div className="w-full xl:flex">
                <PatientConsultations consultationsPage={consultations} patient={record.patient} />
                <PatientPrescriptions prescriptionsPage={prescriptions} patient={record.patient} />
            </div>
        </section>
    )
}
