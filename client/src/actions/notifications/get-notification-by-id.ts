"use server"

import { NOTIFICATION_GET_BY_ID } from "@/utils/api-urls"
import verifyAuthentication from "@/utils/verify-authentication"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import ResponseError from "@/actions/response-error"
import { revalidateTag } from "next/cache"
import { Notification } from "@/interfaces/notifications"

interface GetNotificationById {
    userId: string
    notifId: number
}

export default async function getNotificationById({ userId, notifId }: GetNotificationById) {
    const authToken = verifyAuthentication()

    try {
        const URL = NOTIFICATION_GET_BY_ID(userId, notifId)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken,
            },
            cache: "no-cache",
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        revalidateTag("context")

        const data = responseData.data as Notification

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
