"use server"

import verifyAuthentication from "@/utils/verify-authentication"
import { NOTICES_GET_ALL } from "@/utils/api-urls"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import ResponseError from "@/actions/response-error"
import { PaginatedNotices } from "@/interfaces/notices"

export default async function getAllNoticesPaginated(
    page: number,
    perPage: number,
    direction: string,
    orderBy: string,
) {
    const authToken = verifyAuthentication()

    try {
        const URL = NOTICES_GET_ALL(page, perPage, direction, orderBy)
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken,
            },
            next: { revalidate: 60, tags: ["notices"] },
        })

        const json = await response.json()

        console.log("JSON: ", json)

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
