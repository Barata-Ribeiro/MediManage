"use server"

import patchChangeNotificationStatus from "@/actions/notifications/patch-change-notification-status"
import ResponseError from "@/actions/response-error"
import { auth } from "@/auth"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { Notification } from "@/interfaces/notifications"
import { NOTIFICATION_GET_BY_ID } from "@/utils/api-urls"
import { revalidateTag } from "next/cache"

interface GetNotificationById {
    userId: string
    notifId: number
}

export default async function getNotificationById({ userId, notifId }: GetNotificationById) {
    const session = await auth()

    try {
        const URL = NOTIFICATION_GET_BY_ID(userId, notifId)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
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
