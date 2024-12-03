"use server"

import ResponseError from "@/actions/response-error"
import { tokenName } from "@/constants"
import { ApiResponse, ProblemDetails, State } from "@/interfaces/actions"
import { AUTH_LOGOUT } from "@/utils/api-urls"
import getAuthCookies from "@/utils/get-auth-cookies"
import { signOut } from "auth"
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies"
import { cookies } from "next/headers"

export default async function deleteAuthLogout(): Promise<State> {
    try {
        const URL = AUTH_LOGOUT()

        const refreshToken = cookies().get(tokenName)?.value
        if (!refreshToken) return ResponseError("No refresh token found.")

        const response = await fetch(URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-Refresh-Token": refreshToken,
            },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        await signOut({ redirect: false })

        const cookieStore = await getAuthCookies()
        if (cookieStore) {
            ;(cookieStore as RequestCookie[]).forEach(cookie => cookies().delete(cookie.name))
        }

        const responseData = json as ApiResponse

        return {
            ok: true,
            error: null,
            response: responseData,
        }
    } catch (error) {
        return ResponseError(error)
    }
}
