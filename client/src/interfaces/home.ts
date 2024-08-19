import { Consultation } from "@/interfaces/consultations"
import { MedicalRecord } from "@/interfaces/records"

interface AdministratorInfo {
    allUsers: number
    consultationsByStatus: Record<string, number>
    totalPrescriptions: number
}

interface PatientInfo {
    latestPrescription: object
    nextConsultation: Consultation | object
    medicalRecord: MedicalRecord | object
}

interface AssistantInfo {
    consultationsByStatus: Record<string, number>
    todayConsultations: number
    latestNotice: object
}

interface DoctorInfo {
    nextConsultation: Consultation | object
    consultationsByStatus: Record<string, number>
    latestNotice: object
}

export type { AdministratorInfo, PatientInfo, AssistantInfo, DoctorInfo }
