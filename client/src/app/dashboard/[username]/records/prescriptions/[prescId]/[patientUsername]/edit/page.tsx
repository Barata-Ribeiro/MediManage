import { notFound } from "next/navigation"
import getPrescriptionByIdAndUsername from "@/actions/prescriptions/get-prescription-by-id-and-username"
import { Prescription } from "@/interfaces/prescriptions"
import StateError from "@/components/helpers/state-error"
import { ProblemDetails } from "@/interfaces/actions"
import EditPrescriptionForm from "@/components/forms/edit-prescription-form"
import parseDate from "@/utils/parse-date"

interface EditPrescPageProps {
    params: { username: string; prescId: string; patientUsername: string }
}

export async function generateMetadata({ params }: Readonly<EditPrescPageProps>) {
    return {
        title: `Edit Prescription for ${params.patientUsername}`,
        description: `Edit the prescription for the patient ${params.patientUsername}. Make the necessary changes and click the update button to save the changes.`,
    }
}

export default async function EditPrescPage({ params }: Readonly<EditPrescPageProps>) {
    if (!params.username || !params.prescId || !params.patientUsername) return notFound()

    const state = await getPrescriptionByIdAndUsername({ id: params.prescId, username: params.patientUsername })
    if (!state.ok) return <StateError error={state.error as ProblemDetails} />

    const prescription = state.response?.data as Prescription

    return (
        <section id="edit-prescription-section" aria-labelledby="edit-prescription-section-title">
            <div>
                <h1
                    id="edit-prescription-section-title"
                    className="w-max text-base font-bold leading-6 text-neutral-900">
                    Edit prescription for {prescription.patient.fullName ?? prescription.patient.username}
                </h1>
                <p className="mt-2 max-w-xl text-sm text-neutral-700">
                    Edit the prescription for the patient. Make the necessary changes and click the{" "}
                    <strong>update</strong> button to save the changes.
                </p>
            </div>

            <div className="mt-6 border-t border-neutral-200">
                <dl className="divide-y divide-neutral-200">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900">Patient</dt>
                        <dd className="mt-1 text-sm leading-6 text-neutral-700 sm:col-span-2 sm:mt-0">
                            {prescription.patient.fullName ?? prescription.patient.username}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900">Doctor</dt>
                        <dd className="mt-1 text-sm leading-6 text-neutral-700 sm:col-span-2 sm:mt-0">
                            {prescription.doctor.fullName ?? prescription.doctor.username}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-neutral-900">Issued At</dt>
                        <dd className="mt-1 text-sm leading-6 text-neutral-700 sm:col-span-2 sm:mt-0">
                            {parseDate(prescription.createdAt)}
                        </dd>
                    </div>
                    {prescription.updatedAt !== prescription.createdAt && (
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-neutral-900">Last Update</dt>
                            <dd className="mt-1 text-sm leading-6 text-neutral-700 sm:col-span-2 sm:mt-0">
                                {parseDate(prescription.updatedAt)}
                            </dd>
                        </div>
                    )}
                </dl>
            </div>

            <EditPrescriptionForm
                id={params.prescId}
                patientUsername={params.patientUsername}
                prevContent={prescription.text}
            />
        </section>
    )
}
