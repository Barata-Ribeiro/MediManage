import ConsultationEmptySkeleton from "@/components/dashboard/skeletons/consultation-empty-skeleton"
import { Consultation } from "@/interfaces/consultations"

interface NextConsultationProps {
    data: Consultation | object
}

export default function NextConsultation({ data }: Readonly<NextConsultationProps>) {
    if (Object.keys(data).length === 0) return <ConsultationEmptySkeleton />

    return (
        <div>
            <p>Consultation ID: {(data as Consultation).id}</p>
            <h2>Next Consultation: {(data as Consultation).patient.fullName}</h2>
            <p>Consultation Date: {(data as Consultation).scheduledTo}</p>
            <p>Consultation Status: {(data as Consultation).status}</p>
        </div>
    )
}
