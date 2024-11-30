import NextAuth, { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const config = {
    pages: {
        newUser: "/auth/register",
        signIn: "/auth/login",
    },
    providers: [Credentials({})],
    callbacks: {},
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth(config)
