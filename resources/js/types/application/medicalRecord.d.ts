import { PaginationMeta }                from '@/types';
import { PatientInfo, TablePatientInfo } from '@/types/application/patient';

export interface MedicalRecord {
    id: number;
    patient_info_id: number;
    medical_notes: string;
    created_at: Date;
    updated_at: Date;
    patient_info: PatientInfo;
}

export type TableMedicalRecord = Omit<MedicalRecord, 'medical_notes'> & {
    patient_info: TablePatientInfo;
};

export type PaginationMedicalRecord = PaginationMeta<TableMedicalRecord[]>;
