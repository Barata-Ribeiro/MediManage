/* eslint-disable @typescript-eslint/no-unused-vars */

import { User as Context } from "@/interfaces/users"
import { DefaultSession } from "next-auth"
import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface User {
        user: Context
        accessToken: string
        accessTokenExpiresAt: string
        refreshToken?: string | null
        refreshTokenExpiresAt?: string | null
    }

    interface Session {
        user: Context & DefaultSession["user"]
        accessToken: string
        accessTokenExpiresAt: string
        error?: string | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: Context
        accessToken: string
        accessTokenExpiresAt: string
        refreshToken?: string | null
        refreshTokenExpiresAt?: string | null
        error?: string | null
    }
}
