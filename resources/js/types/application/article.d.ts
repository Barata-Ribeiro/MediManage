import { PaginationMeta } from '@/types';
import { User } from '@/types/admin/users';

export interface Category {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
    articles_count?: number;
}

export interface Article {
    id: number;
    user_id: number;
    title: string;
    subtitle: string;
    slug: string;
    excerpt: string;
    content_html: string;
    content_json?: string;
    thumbnail: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    user?: Partial<User>;
    categories?: Category[];
    reading_time: number;
}

export type TableArticle = Pick<
    Article,
    'id' | 'user_id' | 'title' | 'slug' | 'is_published' | 'created_at' | 'updated_at' | 'user'
>;

export type PaginationArticle = PaginationMeta<TableArticle[]>;
