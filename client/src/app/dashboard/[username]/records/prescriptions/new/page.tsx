import { RecordsPageProps } from "@/app/dashboard/[username]/records/page"
import NewPrescriptionForm from "@/components/forms/new-prescription-form"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
    title: "New Prescription",
    description: "Create a new prescription for a patient.",
}

export default function NewPrescriptionPage({ params, searchParams }: Readonly<RecordsPageProps>) {
    if (!params.username) return notFound()
    if (!searchParams) return null

    const userId = searchParams.user as string

    return (
        <section id="new-prescription-section" aria-labelledby="new-prescription-section-title">
            <div>
                <h1
                    id="new-prescription-section-title"
                    className="w-max text-base font-bold leading-6 text-neutral-900">
                    Write a new prescription
                </h1>
                <p className="mt-2 max-w-xl text-sm text-neutral-700">
                    Write a new prescription for a patient. Fill in the field below and click the <strong>issue</strong>{" "}
                    button to create a new prescription.
                    <br />
                    <br />
                    {/* */}A PDF copy of the prescription will be generated and be made available for download.
                </p>
            </div>

            <NewPrescriptionForm userId={userId} />
        </section>
    )
}
