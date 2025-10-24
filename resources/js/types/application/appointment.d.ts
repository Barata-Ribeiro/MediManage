import { PaginationMeta } from '@/types';
import { User } from '@/types/admin/users';
import { EmployeeInfo } from '@/types/application/employee';
import { AppointmentStatus } from '@/types/application/enums';
import { PatientInfo } from '@/types/application/patient';

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

export interface UpcomingAppointment extends Appointment {
    patient_info: Pick<
        PatientInfo,
        'id' | 'first_name' | 'last_name' | 'gender' | 'date_of_birth' | 'phone_number' | 'age' | 'full_name'
    > & { user?: Pick<User, 'id' | 'name' | 'avatar'> };
    employee_info: Pick<EmployeeInfo, 'id' | 'first_name' | 'last_name' | 'gender' | 'specialization' | 'full_name'> & {
        user: Pick<User, 'id' | 'name' | 'avatar'>;
    };
}

export type PaginatedUpcomingAppointments = PaginationMeta<UpcomingAppointment[]>;
