import { SimpleUser } from "@/interfaces/users"

interface Notification {
    id: number
    title: string
    message: string
    user: SimpleUser
    isRead: boolean
    issuedAt: string
    readAt: string
}

interface PaginatedNotifications {
    content: Notification[]
    page: {
        size: number
        number: number
        totalElements: number
        totalPages: number
    }
}

export type { Notification, PaginatedNotifications }
