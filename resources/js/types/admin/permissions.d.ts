import { PaginationMeta } from '@/types';

export interface Permission {
    id: number;
    title: string;
    name: string;
    guard_name?: string;
    created_at: string;
    updated_at: string;
}

export type PaginationPermissions = PaginationMeta<Permission[]>;
