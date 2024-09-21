import { SimpleUser } from "@/interfaces/users"

enum NoticeType {
    ANNOUNCEMENT = "ANNOUNCEMENT",
    WARNING = "WARNING",
    ALERT = "ALERT",
    INFOS = "INFOS",
}

enum NoticeStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

interface Notice {
    id: number
    title: string
    description: string
    mediaUrl: string
    type: NoticeType
    status: NoticeStatus
    issuer: SimpleUser
    createdAt: string
    updatedAt: string
}

interface PaginatedNotices {
    content: Notice[]
    page: {
        size: number
        number: number
        totalElements: number
        totalPages: number
    }
}

export type { Notice, NoticeType, NoticeStatus, PaginatedNotices }
