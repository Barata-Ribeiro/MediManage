import { Consultation } from "@/interfaces/consultations"
import { MedicalRecord } from "@/interfaces/records"
import { Prescription, SimplePrescription } from "@/interfaces/prescriptions"
import { Notice } from "@/interfaces/notices"

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
    todayConsultations: Consultation[]
    latestNotice: Notice | object
}

interface DoctorInfo {
    nextConsultation: Consultation | object
    consultationsByStatus: Record<string, number>
    latestNotice: Notice | object
    recentPrescriptions: SimplePrescription[]
}

export type { AdministratorInfo, PatientInfo, AssistantInfo, DoctorInfo }
