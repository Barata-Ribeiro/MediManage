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
    accountType: UserAccountType
    userRoles: UserRoles
    createdAt: string
    updatedAt: string
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

export type { User }
