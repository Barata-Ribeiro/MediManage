"use server"

import ResponseError from "@/actions/response-error"
import { auth } from "@/auth"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { User } from "@/interfaces/users"
import { USER_GET_PROFILE_BY_ID } from "@/utils/api-urls"

export default async function getUserProfileById(id: string) {
    const session = await auth()
    try {
        if (!id) return ResponseError(new Error("User ID is required"))

        const URL = USER_GET_PROFILE_BY_ID(id)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            next: { revalidate: 30, tags: ["context", "users"] },
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
