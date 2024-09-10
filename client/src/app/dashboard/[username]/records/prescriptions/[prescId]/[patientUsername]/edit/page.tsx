import { notFound } from "next/navigation"

interface EditPrescPageProps {
    params: { username: string; prescId: string; patientUsername: string }
}

export default function EditPrescPage({ params }: Readonly<EditPrescPageProps>) {
    if (!params.username || !params.prescId || !params.patientUsername) return notFound()
    return <div></div>
}
