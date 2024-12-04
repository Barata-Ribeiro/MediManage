"use server"

import ResponseError from "@/actions/response-error"
import { auth } from "@/auth"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { PaginatedNotifications } from "@/interfaces/notifications"
import { NOTIFICATIONS_GET_ALL } from "@/utils/api-urls"

export default async function getAllUserNotifications(
    userId: string,
    page = 0,
    perPage = 10,
    direction = "ASC",
    orderBy = "issuedAt",
    isRead: string | null = null,
) {
    const session = await auth()
    try {
        const URL = NOTIFICATIONS_GET_ALL(userId, page, perPage, direction, orderBy, isRead)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
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
