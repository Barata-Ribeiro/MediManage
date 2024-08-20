"use client"

import { Consultation } from "@/interfaces/consultations"
import ConsultationEmptySkeleton from "@/components/dashboard/skeletons/consultation-empty-skeleton"

interface NextConsultationProps {
    data: Consultation | object
}

export default function NextConsultation({ data }: Readonly<NextConsultationProps>) {
    if (Object.keys(data).length === 0) return <ConsultationEmptySkeleton />

    return <div></div>
}
