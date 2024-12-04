"use server"

import ResponseError from "@/actions/response-error"
import { auth } from "@/auth"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { SimpleUser } from "@/interfaces/users"
import { USER_GET_SEARCH_SUGGESTIONS } from "@/utils/api-urls"

export default async function getUserSearchSuggestions(query: string, type: string) {
    const session = await auth()
    try {
        const URL = USER_GET_SEARCH_SUGGESTIONS(query, type)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            next: { tags: ["context", "users"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as SimpleUser[]

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
