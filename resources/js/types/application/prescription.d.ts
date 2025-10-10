import { PaginationMeta } from '@/types';
import { PatientInfo, TablePatientInfo } from '@/types/application/patient';
import { EmployeeInfo } from './employee';

export interface Prescription {
    id: number;
    validation_code: string;
    is_valid: boolean;
    patient_info_id: number;
    employee_info_id: number;
    prescription_details_html?: string;
    prescription_details_json?: string;
    date_issued: Date;
    date_expires: Date;
    created_at: Date;
    updated_at: Date;

    patient_info: Partial<PatientInfo>;
    employee_info: Partial<EmployeeInfo>;
    qr_code: string; // Base64 encoded string
}

export type TablePrescription = Omit<Prescription, 'prescription_details_html' | 'prescription_details_json'> & {
    patient_info: TablePatientInfo;
};

export type PaginationPrescriptions = PaginationMeta<TablePrescription[]>;
