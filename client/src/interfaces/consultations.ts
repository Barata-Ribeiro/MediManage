import { User } from "@/interfaces/users"

interface Consultation {
    id: number
    patient: User
    doctor: User
    scheduledTo: string
    status: ConsultationStatus
    createdAt: string
    updatedAt: string
}

enum ConsultationStatus {
    SCHEDULED = "SCHEDULED",
    ACCEPTED = "ACCEPTED",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
    MISSED = "MISSED",
    CANCELLED = "CANCELLED",
}

interface PaginatedConsultations {
    content: Consultation[]
    page: {
        size: number
        number: number
        totalElements: number
        totalPages: number
    }
}

export type { Consultation, PaginatedConsultations }
