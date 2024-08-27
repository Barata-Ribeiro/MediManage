"use server"

import ResponseError from "@/actions/response-error"
import verifyAuthentication from "@/utils/verify-authentication"
import { NOTIFICATIONS_GET_ALL } from "@/utils/api-urls"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { PaginatedNotifications } from "@/interfaces/notifications"

export default async function getAllUserNotifications(
    userId: string,
    page = 0,
    perPage = 10,
    direction = "ASC",
    orderBy = "issuedAt",
) {
    const authToken = verifyAuthentication()
    try {
        const URL = NOTIFICATIONS_GET_ALL(userId, page, perPage, direction, orderBy)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken,
            },
            cache: "no-store",
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as PaginatedNotifications

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
