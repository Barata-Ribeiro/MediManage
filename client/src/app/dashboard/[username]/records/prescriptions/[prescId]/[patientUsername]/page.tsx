import { notFound } from "next/navigation"

interface PrescViewPageProps {
    params: { username: string; prescId: string; patientUsername: string }
}

export default function PrescViewPage({ params }: Readonly<PrescViewPageProps>) {
    if (!params.username || !params.prescId || !params.patientUsername) return notFound()
    return <div></div>
}
