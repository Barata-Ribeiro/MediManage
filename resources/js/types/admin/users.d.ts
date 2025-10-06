import { PaginationMeta } from '@/types';
import { Role } from '@/types/admin/roles';

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    email_verified_at: string;
    two_factor_secret?: string;
    two_factor_recovery_codes?: string;
    two_factor_confirmed_at?: string;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    roles?: Role[];
    patient_info_id?: number;
    employee_info_id?: number;
    [key: string]: unknown;
}

export type PaginationUsers = PaginationMeta<User[]>;
