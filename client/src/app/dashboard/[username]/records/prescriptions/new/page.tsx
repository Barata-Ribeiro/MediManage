import { RecordsPageProps } from "@/app/dashboard/[username]/records/page"
import { notFound } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "New Prescription",
    description: "Create a new prescription for a patient.",
}

export default function NewPrescriptionPage({ params, searchParams }: Readonly<RecordsPageProps>) {
    if (!params.username) return notFound()
    if (!searchParams) return null

    const userId = searchParams.user as string
    const requestingUsername = params.username

    return (
        <div>
            <div>
                <h1 className="w-max text-base font-bold leading-6 text-neutral-900">Write a new prescription</h1>
                <p className="mt-2 max-w-xl text-sm text-neutral-700">
                    Write a new prescription for a patient. Fill in the form below with the necessary information.
                </p>
            </div>
        </div>
    )
}
