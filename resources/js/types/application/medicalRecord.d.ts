import { PaginationMeta, ScrollMeta } from '@/types';
import { Appointment } from '@/types/application/appointment';
import { EmployeeInfo } from '@/types/application/employee';
import { MedicalRecordEntryType } from '@/types/application/enums';
import { PatientInfo, TablePatientInfo } from '@/types/application/patient';

export interface MedicalRecord {
    id: number;
    patient_info_id: number;
    medical_notes_html: string;
    medical_notes_json?: string;
    created_at: Date;
    updated_at: Date;
    patient_info: PatientInfo;
}

export interface MedicalRecordEntry {
    id: number;
    medical_record_id: number;
    employee_info_id: number;
    appointment_id: number;

    title: string;
    content_html: string;
    content_json?: string;
    entry_type: MedicalRecordEntryType;
    is_visible_to_patient: boolean;

    created_at: Date;
    updated_at: Date;
}

export interface MedicalRecordEntryWithRelations extends MedicalRecordEntry {
    appointment: Appointment;
    employee_info: EmployeeInfo;
}

export type TableMedicalRecord = Omit<MedicalRecord, 'medical_notes'> & {
    patient_info: TablePatientInfo;
};

export type PaginationMedicalRecord = PaginationMeta<TableMedicalRecord[]>;
export type ScrollableMedicalRecordEntry = ScrollMeta<MedicalRecordEntry>;
