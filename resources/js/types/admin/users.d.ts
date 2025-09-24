import { PaginationMeta } from '@/types';

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type PaginationUsers = PaginationMeta<User[]>;
