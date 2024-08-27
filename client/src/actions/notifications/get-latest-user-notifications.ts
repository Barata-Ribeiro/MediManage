"use server"

import verifyAuthentication from "@/utils/verify-authentication"
import ResponseError from "@/actions/response-error"
import { NOTIFICATIONS_GET_LATEST } from "@/utils/api-urls"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { Notification } from "@/interfaces/notifications"

export default async function getLatestUserNotifications(userId: string) {
    const authToken = verifyAuthentication()

    try {
        const URL = NOTIFICATIONS_GET_LATEST(userId)

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

        const data = responseData.data as Notification[]

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
