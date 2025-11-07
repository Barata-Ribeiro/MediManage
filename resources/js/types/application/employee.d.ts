import { User } from '@/types/admin/users';
import { Contract } from '@/types/application/contract';

export interface EmployeeInfo {
    id: number;
    user_id?: number;
    medical_record_id: number;

    first_name: string;
    last_name: string;
    full_name?: string;
    gender: string;
    date_of_birth: Date;
    age?: number;
    phone_number: string;
    address: string;

    registration_number?: string;
    registration_origin?: string;
    specialization?: string;
    license_number?: string;
    license_expiry_date?: Date;

    position: string;
    is_active: boolean;
    hire_date: Date;
    termination_date?: Date;

    created_at: Date;
    updated_at: Date;
}

export interface EmployeeInfoWithRelations extends EmployeeInfo {
    user?: User;
    medical_record?: MedicalRecord;
    contracts?: Contract[];
}

export type TableEmployeeInfo = Pick<
    EmployeeInfo,
    'id' | 'first_name' | 'last_name' | 'position' | 'is_active' | 'created_at' | 'updated_at' | 'full_name'
>;

export type PaginationEmployees = Pagination<TableEmployeeInfo>;
