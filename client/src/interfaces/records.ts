import { User } from "@/interfaces/users"

interface MedicalRecord {
    id: string
    patient: User
    insuranceCompany: string
    insuranceMemberIdNumber: string
    insuranceGroupNumber: string
    insurancePolicyNumber: string
    allergies: string
    medications: string
    medicalHistory: string
    familyMedicalHistory: string
    createdAt: string
    updatedAt: string
}

interface SimpleMedicalRecord {
    id: string
    patient: User
    createdAt: string
    updatedAt: string
}

interface PaginatedSimpleRecords {
    content: SimpleMedicalRecord[]
    page: {
        size: number
        number: number
        totalElements: number
        totalPages: number
    }
}

export type { MedicalRecord, SimpleMedicalRecord, PaginatedSimpleRecords }
