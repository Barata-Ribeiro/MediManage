"use client"

import { Consultation } from "@/interfaces/consultations"

interface NextConsultationProps {
    data: Consultation | object
}

export default function NextConsultation({ data }: Readonly<NextConsultationProps>) {
    if (Object.keys(data).length === 0) return null

    return <div></div>
}
