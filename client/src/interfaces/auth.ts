import { User, UserAccountType, UserRoles } from "@/interfaces/users"

interface LoginResponse {
    user: User
    token: string
    tokenExpiresAt: string
}

interface NewAccountResponse {
    username: string
    password: string
    registeredAt: string
    message: string
}

interface AuthToken {
    iss: string
    sub: string
    exp: number
    role: UserRoles
    accountType: UserAccountType
    jti: string
}

export type { LoginResponse, NewAccountResponse, AuthToken }
