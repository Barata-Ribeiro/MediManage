"use server"

import ResponseError from "@/actions/response-error"
import { auth } from "@/auth"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { Consultation } from "@/interfaces/consultations"
import { CONSULTATIONS_UPDATE_BY_ID } from "@/utils/api-urls"
import { revalidateTag } from "next/cache"

export default async function patchUpdateConsultation(
    consultId: string,
    consultStatus?: string | null,
    consultScheduleTo?: string | null,
) {
    const session = await auth()
    try {
        if (!consultId) return ResponseError(new Error("Consultation ID is required."))
        if (!consultStatus && !consultScheduleTo) {
            return ResponseError(new Error("Consultation status or schedule to is required."))
        }

        const URL = CONSULTATIONS_UPDATE_BY_ID(consultId)

        const response = await fetch(URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            body: JSON.stringify({ status: consultStatus, scheduledTo: consultScheduleTo }),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const updateAccountResponse = responseData.data as Consultation

        revalidateTag("consultations")

        return {
            ok: true,
            error: null,
            response: { ...responseData, updateAccountResponse },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
