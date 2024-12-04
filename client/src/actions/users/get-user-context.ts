"use server"

import ResponseError from "@/actions/response-error"
import { auth } from "@/auth"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { User } from "@/interfaces/users"
import { USER_GET_CONTEXT } from "@/utils/api-urls"

export default async function getUserContext() {
    const session = await auth()
    try {
        const URL = USER_GET_CONTEXT()

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            next: { revalidate: 5, tags: ["context"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as User

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
