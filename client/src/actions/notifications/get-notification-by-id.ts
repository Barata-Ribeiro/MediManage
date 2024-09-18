"use server"

import { NOTIFICATION_GET_BY_ID } from "@/utils/api-urls"
import verifyAuthentication from "@/utils/verify-authentication"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import ResponseError from "@/actions/response-error"
import { revalidateTag } from "next/cache"
import { Notification } from "@/interfaces/notifications"
import patchChangeNotificationStatus from "@/actions/notifications/patch-change-notification-status"

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

        let responseData = json as ApiResponse
        let data = responseData.data as Notification

        revalidateTag("context")

        if (!data.isRead) {
            const markResponseAsRead = await patchChangeNotificationStatus({
                userId,
                notifId: notifId.toString(),
                currentStatus: data.isRead.toString(),
            })

            if (!markResponseAsRead.ok) return ResponseError(markResponseAsRead.error)

            data = markResponseAsRead.response?.data as Notification
            responseData = { ...responseData, data }
        }

        return {
            ok: true,
            error: null,
            response: responseData,
        }
    } catch (error) {
        return ResponseError(error)
    }
}
