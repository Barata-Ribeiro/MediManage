import { Consultation } from "@/interfaces/consultations"
import { Notice } from "@/interfaces/notices"
import { Prescription, SimplePrescription } from "@/interfaces/prescriptions"
import { MedicalRecord } from "@/interfaces/records"

interface AdministratorInfo {
    allUsers: Record<string, number>
    consultationsByStatus: Record<string, number>
    totalPrescriptions: number
    totalArticles: number
    latestNotice: Notice | object
}

interface PatientInfo {
    latestPrescription: Prescription | object
    nextConsultation: Consultation | object
    medicalRecord: MedicalRecord | object
    latestNotice: Notice | object
}

interface AssistantInfo {
    consultationsByStatus: Record<string, number>
    totalConsultationsForToday: Record<string, number>
    consultationsForToday: Consultation[]
    latestNotice: Notice | object
}

interface DoctorInfo {
    nextConsultation: Consultation | object
    consultationsByStatus: Record<string, number>
    latestNotice: Notice | object
    recentPrescriptions: SimplePrescription[]
}

export type { AdministratorInfo, PatientInfo, AssistantInfo, DoctorInfo }
