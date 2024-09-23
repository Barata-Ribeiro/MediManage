"use server"

import { ApiResponse, ProblemDetails, State } from "@/interfaces/actions"
import { NOTICES_CREATE } from "@/utils/api-urls"
import verifyAuthentication from "@/utils/verify-authentication"
import { z } from "zod"
import ResponseError from "@/actions/response-error"
import { Notice } from "@/interfaces/notices"

const noticeSchema = z.object({
    title: z
        .string()
        .trim()
        .min(5, "Notice title must be at least 5 characters")
        .max(100, "Notice title must be at most 100 characters"),
    description: z.string().trim().min(5, "Notice description must be at least 5 characters"),
    mediaUrl: z.string().url("Media URL must be a valid URL").optional(),
    type: z.enum(["ANNOUNCEMENT", "WARNING", "ALERT", "INFOS"]),
    status: z.enum(["ACTIVE", "INACTIVE"]),
})

export default async function postNewNotice(state: State, formData: FormData) {
    const authToken = verifyAuthentication()
    try {
        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = noticeSchema.safeParse(rawFormData)

        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }

        const URL = NOTICES_CREATE()

        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken,
            },
            body: JSON.stringify(parsedFormData.data),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as Notice

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
