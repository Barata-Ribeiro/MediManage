"use server"

import { cookies } from "next/headers"
import { ApiResponse, State } from "@/interfaces/actions"

export default async function logout(): Promise<State> {
    const requestCookies = cookies().getAll()

    if (requestCookies.length === 0) {
        return {
            ok: false,
            error: "You are not logged in.",
            response: null,
        }
    }

    for (const cookie of requestCookies) {
        cookies().delete(cookie.name)
    }

    const responseData: ApiResponse = {
        status: "success",
        code: 200,
        message: "You have been successfully logged out.",
        data: null,
    }

    return {
        ok: true,
        error: null,
        response: responseData,
    }
}
