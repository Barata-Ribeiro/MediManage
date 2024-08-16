import { SimpleUser, User } from "@/interfaces/users"

interface Prescription {
    id: number
    patient: User
    doctor: User
    text: string
    createdAt: string
    updatedAt: string
}

interface SimplePrescription {
    id: number
    patient: SimpleUser
    doctor: SimpleUser
    createdAt: string
    updatedAt: string
}

interface PaginatedSimplePrescriptions {
    content: SimplePrescription[]
    page: {
        size: number
        number: number
        totalElements: number
        totalPages: number
    }
}

export type { Prescription, SimplePrescription, PaginatedSimplePrescriptions }
