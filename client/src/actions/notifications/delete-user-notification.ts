"use server"

import verifyAuthentication from "@/utils/verify-authentication"
import ResponseError from "@/actions/response-error"
import { NOTIFICATION_DELETE_BY_ID } from "@/utils/api-urls"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { revalidateTag } from "next/cache"

interface DeleteNotificationParams {
    userId: string
    notifId: string
}

export default async function deleteUserNotification({ userId, notifId }: DeleteNotificationParams) {
    const authToken = verifyAuthentication()

    try {
        const URL = NOTIFICATION_DELETE_BY_ID(userId, notifId)

        const response = await fetch(URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken,
            },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        revalidateTag("context")

        return {
            ok: true,
            error: null,
            response: responseData,
        }
    } catch (error) {
        return ResponseError(error)
    }
}
