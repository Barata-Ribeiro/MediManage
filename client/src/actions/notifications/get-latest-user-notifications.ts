"use server"

import ResponseError from "@/actions/response-error"
import { auth } from "@/auth"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { Notification } from "@/interfaces/notifications"
import { NOTIFICATIONS_GET_LATEST } from "@/utils/api-urls"

export default async function getLatestUserNotifications(userId: string) {
    const session = await auth()

    try {
        const URL = NOTIFICATIONS_GET_LATEST(userId)

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
