import { RecordsPageProps } from "@/app/dashboard/[username]/records/page"
import NewPrescriptionModal from "@/components/modals/new-prescription-modal"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "New Prescription",
        description: "Create a new prescription for a patient.",
    }
}

export default function NewPrescriptionModalPage({ params, searchParams }: Readonly<RecordsPageProps>) {
    if (!params.username) return notFound()
    if (!searchParams) return null

    const userId = searchParams.user as string
    return <NewPrescriptionModal userId={userId} />
}
