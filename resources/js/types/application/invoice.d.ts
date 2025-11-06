import { PatientInfo } from './patient';

export interface Invoice {
    id: number;
    patient_info_id: number;
    consultation_date: string;
    notes: string;
    due_date: string;
    amount: string;
    payment_method: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface InvoiceWithRelations extends Invoice {
    patient_info: PatientInfo;
}

export type PaginationInvoice = PaginationMeta<Invoice[]>;
export type PaginationInvoiceWithRelations = PaginationMeta<InvoiceWithRelations[]>;
