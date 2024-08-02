import { User } from "@/interfaces/users"

interface LoginResponse {
    user: User
    token: string
    tokenExpiresAt: string
}

export type { LoginResponse }
