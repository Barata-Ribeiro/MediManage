import { User } from "@/interfaces/users"

interface LoginResponse {
    user: User
    token: string
    tokenExpiresAt: string
}

interface NewEmployeeResponse {
    username: string
    password: string
    registeredAt: string
    message: string
}

export type { LoginResponse, NewEmployeeResponse }
