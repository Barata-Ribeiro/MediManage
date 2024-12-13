import { SimpleDoctor, SimpleUser } from "@/interfaces/users"

interface Article {
    id: number
    title: string
    subTitle: string
    content: string
    slug: string
    mediaUrl: string
    wasEdit: boolean
    createdAt: string
    updatedAt: string
    author: SimpleDoctor
    categories: ArticleCategory[]
}

interface ArticleCategory {
    id: number
    name: string
    description: string
}

interface SimpleArticle {
    id: number
    title: string
    subTitle: string
    slug: string
    mediaUrl: string
    author: SimpleUser
    createdAt: string
}

interface PaginatedSimpleArticles {
    content: SimpleArticle[]
    page: {
        size: number
        number: number
        totalElements: number
        totalPages: number
    }
}

export type { Article, ArticleCategory, SimpleArticle, PaginatedSimpleArticles }
