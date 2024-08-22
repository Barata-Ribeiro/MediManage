import { Consultation } from "@/interfaces/consultations"
import { MedicalRecord } from "@/interfaces/records"
import { Prescription } from "@/interfaces/prescriptions"

interface AdministratorInfo {
    allUsers: Record<string, number>
    consultationsByStatus: Record<string, number>
    totalPrescriptions: number
}

interface PatientInfo {
    latestPrescription: Prescription | object
    nextConsultation: Consultation | object
    medicalRecord: MedicalRecord | object
}

interface AssistantInfo {
    consultationsByStatus: Record<string, number>
    todayConsultations: Consultation[]
    latestNotice: object
}

interface DoctorInfo {
    nextConsultation: Consultation | object
    consultationsByStatus: Record<string, number>
    latestNotice: object
}

export type { AdministratorInfo, PatientInfo, AssistantInfo, DoctorInfo }
