import { PaginationMeta } from '@/types';
import { Permission } from '@/types/admin/permissions';

export interface Role {
    id: number;
    name: string;
    guard_name?: string;
    permissions?: Permission[];
    created_at: string;
    updated_at: string;
}

export type PaginationRoles = PaginationMeta<Role[]>;
