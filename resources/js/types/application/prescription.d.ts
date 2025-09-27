import { PaginationMeta } from '@/types';
import { PatientInfo, TablePatientInfo } from '@/types/application/patient';

export interface Prescription {
    id: number;
    patient_info_id: number;
    employee_info_id: number;
    prescription_details: string;
    date_issued: string;
    date_expires: string;
    created_at: string;
    updated_at: string;
    patient_info: PatientInfo;
}

export type TablePrescription = Omit<Prescription, 'prescription_details'> & {
    patient_info: TablePatientInfo;
};

export type PaginationPrescriptions = PaginationMeta<TablePrescription[]>;
