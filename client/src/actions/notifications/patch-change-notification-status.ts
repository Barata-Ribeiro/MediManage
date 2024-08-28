"use server"

import ResponseError from "@/actions/response-error"
import verifyAuthentication from "@/utils/verify-authentication"
import { NOTIFICATION_CHANGE_STATUS } from "@/utils/api-urls"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { Notification } from "@/interfaces/notifications"
import { revalidateTag } from "next/cache"

interface NotificationParams {
    userId: string
    notifId: string
    currentStatus: string
}

export default async function patchChangeNotificationStatus({ userId, notifId, currentStatus }: NotificationParams) {
    const authToken = verifyAuthentication()

    try {
        const URL = NOTIFICATION_CHANGE_STATUS(userId, notifId, currentStatus !== "true")

        const response = await fetch(URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken,
            },
            body: JSON.stringify({}),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as Notification

        revalidateTag("context")

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
