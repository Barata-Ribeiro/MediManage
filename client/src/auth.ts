import { tokenName } from "@/constants"
import { ApiResponse } from "@/interfaces/actions"
import { LoginResponse } from "@/interfaces/auth"
import { AUTH_LOGIN, AUTH_REFRESH_TOKEN } from "@/utils/api-urls"
import NextAuth, { NextAuthConfig } from "next-auth"
import { JWT } from "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import { cookies } from "next/headers"

/* eslint-disable @typescript-eslint/no-unused-vars */
async function refreshToken(token: JWT) {
    const URL = AUTH_REFRESH_TOKEN()

    const refreshToken = cookies().get(tokenName)?.value
    if (!refreshToken) {
        console.error("No refresh token found.")
        return { ...token, error: "RefreshAccessTokenError" }
    }

    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Refresh-Token": refreshToken,
        },
        body: JSON.stringify({}),
    })

    const json = await response.json()

    if (!response.ok) {
        console.error("Refresh token error: ", json)
        return { ...token, error: "RefreshAccessTokenError" }
    }

    const responseData = json as ApiResponse
    const loginResponse = responseData.data as LoginResponse

    return {
        user: loginResponse.user,
        accessToken: loginResponse.accessToken,
        accessTokenExpiresAt: loginResponse.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        error: null,
    }
}

function getTokenAndExpiration() {
    const token = cookies().get(tokenName)?.value
    if (!token) throw new Error("No token found.")

    const decodedToken = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())

    return {
        token: token,
        expiresAt: decodedToken["exp"] * 1000,
    }
}

export const config = {
    pages: {
        newUser: "/auth/register",
        signIn: "/auth/login",
    },
    providers: [
        Credentials({
            credentials: {
                username: {
                    label: "Email/Username",
                    type: "text",
                    placeholder: "johndoe/janedoe or contact@example.com",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
                rememberMe: {
                    label: "Remember me",
                    type: "checkbox",
                    defaultValue: "false",
                },
            },
            async authorize(credentials, _req) {
                const payload = {
                    emailOrUsername: credentials.username,
                    password: credentials.password,
                    rememberMe: credentials.rememberMe,
                }

                const URL = AUTH_LOGIN()

                const response = await fetch(URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                })

                const json = await response.json()

                if (!response.ok) {
                    throw JSON.stringify(json)
                }

                const responseData = json as ApiResponse
                const loginResponse = responseData.data as LoginResponse

                if (responseData && loginResponse) {
                    cookies().set(tokenName, loginResponse.refreshToken!, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "lax",
                        expires: new Date(loginResponse.refreshTokenExpiresAt!),
                    })

                    return loginResponse
                }

                return null
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user: context, account, trigger, session }) {
            if (account && context) {
                token.user = context.user
                token.accessToken = context.accessToken
                token.accessTokenExpiresAt = context.accessTokenExpiresAt
                token.refreshToken = context.refreshToken
                token.refreshTokenExpiresAt = context.refreshTokenExpiresAt
                token.error = null

                return token
            }

            if (trigger === "update") {
                if (session) {
                    const refreshToken: { token: string; expiresAt: number } = getTokenAndExpiration()

                    token.user = session.user
                    token.accessToken = session.accessToken
                    token.accessTokenExpiresAt = session.accessTokenExpiresAt
                    token.refreshToken = refreshToken.token
                    token.refreshTokenExpiresAt = new Date(Number(refreshToken.expiresAt)).toISOString()
                    token.error = null
                }
            }

            if (
                (token.accessTokenExpiresAt && Date.now() < new Date(token.accessTokenExpiresAt).getTime()) ||
                token.error === "RefreshAccessTokenError"
            ) {
                const { refreshToken, refreshTokenExpiresAt, ...rest } = token

                return rest
            }

            return refreshToken(token)
        },
        async session({ session, token }) {
            session.user = { ...session.user, ...token.user }
            session.accessToken = token.accessToken
            session.accessTokenExpiresAt = token.accessTokenExpiresAt
            session.error = token.error

            return session
        },
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl
        },
    },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth(config)
