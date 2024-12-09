import { SimpleUser } from "@/interfaces/users"

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

export type { SimpleArticle, PaginatedSimpleArticles }
