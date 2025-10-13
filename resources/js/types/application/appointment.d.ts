import { PaginationMeta } from '@/types';
import { EmployeeInfo } from '@/types/application/employee';
import { PatientInfo } from '@/types/application/patient';

export enum AppointmentStatus {
    scheduled = 'scheduled',
    confirmed = 'confirmed',
    checked_in = 'checked_in',
    canceled = 'canceled',
    missed = 'missed',
    completed = 'completed',
}

export interface Appointment {
    id: number;
    patient_info_id: number;
    employee_info_id: number;
    appointment_date: Date;
    status: AppointmentStatus;
    reason_for_visit: string;
    created_at: Date;
    updated_at: Date;
}

export interface AppointmentWithRelations extends Appointment {
    patient_info: PatientInfo;
    employee_info: EmployeeInfo;
}

export interface UpcomingAppointment {
    id: number;
    time: string;
    doctor: string;
    patient: string;
    status: AppointmentStatus;
}

export type PaginatedUpcomingAppointments = PaginationMeta<UpcomingAppointment[]>;
