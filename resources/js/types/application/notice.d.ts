import { User } from '@/types/admin/users';
import { NoticeType } from '@/types/application/enums';

export interface Notice {
    id: number;
    user_id: number;
    title: string;
    description: string;
    type: NoticeType;
    is_active: number;
    created_at: string;
    updated_at: string;
}

interface NoticeWithRelations extends Notice {
    user: User;
}
