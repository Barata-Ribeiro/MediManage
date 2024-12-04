"use server"

import ResponseError from "@/actions/response-error"
import { auth } from "@/auth"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { PaginatedNotices } from "@/interfaces/notices"
import { NOTICES_GET_ALL } from "@/utils/api-urls"

export default async function getAllNoticesPaginated(
    page: number,
    perPage: number,
    direction: string,
    orderBy: string,
) {
    const session = await auth()

    try {
        const URL = NOTICES_GET_ALL(page, perPage, direction, orderBy)
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            next: { revalidate: 60, tags: ["notices"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as PaginatedNotices

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
