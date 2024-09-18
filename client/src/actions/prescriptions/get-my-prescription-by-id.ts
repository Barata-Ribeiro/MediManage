"use server"

import verifyAuthentication from "@/utils/verify-authentication"
import { PRESCRIPTIONS_GET_MINE_BY_ID } from "@/utils/api-urls"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import ResponseError from "@/actions/response-error"
import { Prescription } from "@/interfaces/prescriptions"

interface GetMyPrescriptionById {
    id: string
}

export default async function getMyPrescriptionById({ id }: GetMyPrescriptionById) {
    const authToken = verifyAuthentication()

    try {
        const URL = PRESCRIPTIONS_GET_MINE_BY_ID(id)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken,
            },
            next: { tags: ["prescriptions"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as Prescription

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
