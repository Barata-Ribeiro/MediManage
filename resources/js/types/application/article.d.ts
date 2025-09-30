import { User } from '@/types/admin/users';

export interface Category {
    id: number;
    name: string;
    description?: string;
}

export interface Article {
    id: number;
    user_id: number;
    title: string;
    subTitle: string;
    slug: string;
    content_html: string;
    content_json?: string;
    thumbnail: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    user?: Partial<User>;
    categories?: Category[];
}
