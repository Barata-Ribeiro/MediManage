"use server"

import ResponseError from "@/actions/response-error"
import { auth } from "@/auth"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { PaginatedUsers } from "@/interfaces/users"
import { USER_GET_ALL } from "@/utils/api-urls"

export default async function getAllUsersPaginated(
    page = 0,
    perPage = 10,
    type: string | null = null,
    direction = "ASC",
    orderBy = "createdAt",
) {
    const session = await auth()
    try {
        const URL = USER_GET_ALL(page, perPage, type, direction, orderBy)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            next: { revalidate: 30, tags: ["users"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as PaginatedUsers

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
