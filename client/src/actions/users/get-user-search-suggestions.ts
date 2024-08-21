"use server"

import verifyAuthentication from "@/utils/verify-authentication"
import { USER_GET_SEARCH_SUGGESTIONS } from "@/utils/api-urls"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import ResponseError from "@/actions/response-error"
import { SimpleUser } from "@/interfaces/users"

export default async function getUserSearchSuggestions(query: string, type: string) {
    const authToken = String(verifyAuthentication())
    try {
        const URL = USER_GET_SEARCH_SUGGESTIONS(query, type)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken,
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
