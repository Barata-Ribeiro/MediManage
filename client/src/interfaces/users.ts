interface User {
    id: string
    username: string
    email: string
    fullName: string | null
    phone: string | null
    address: string | null
    birthDate: string | null
    registrationNumber: string | null
    registrationOrigin: string | null
    specialization: string | null
    totalNotifications: number
    totalReadNotifications: number
    totalUnreadNotifications: number
    accountType: UserAccountType
    userRoles: UserRoles
    createdAt: string
    updatedAt: string
}

interface SimpleUser {
    id: string
    username: string
    fullName: string | null
    AccountType: UserAccountType
    userRoles: UserRoles
}

enum UserAccountType {
    PATIENT = "PATIENT",
    ASSISTANT = "ASSISTANT",
    DOCTOR = "DOCTOR",
    ADMINISTRATOR = "ADMINISTRATOR",
}

enum UserRoles {
    NONE = "NONE",
    ADMIN = "ADMIN",
    USER = "USER",
    BANNED = "BANNED",
}

interface PaginatedUsers {
    content: User[]
    page: {
        size: number
        number: number
        totalElements: number
        totalPages: number
    }
}

export type { User, SimpleUser, UserAccountType, UserRoles, PaginatedUsers }
