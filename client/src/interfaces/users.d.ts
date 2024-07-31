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
    accountType: "PATIENT" | "ASSISTANT" | "DOCTOR" | "ADMINISTRATOR"
    userRoles: "NONE" | "ADMIN" | "USER" | "BANNED"
    createdAt: string
    updatedAt: string
}
