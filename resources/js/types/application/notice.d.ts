import { User } from '@/types/admin/users';
import { NoticeType } from '@/types/application/enums';
import { PaginationMeta } from '@/types/index';

export interface Notice {
    id: number;
    user_id: number;

    title: string;
    description: string;
    type: NoticeType;
    is_active: number;

    created_at: Date;
    updated_at: Date;
}

export interface NoticeWithRelations extends Notice {
    user: User;
}

export type TableNotice = Omit<NoticeWithRelations, 'description'>;

export type PaginationNotice = PaginationMeta<TableNotice[]>;
