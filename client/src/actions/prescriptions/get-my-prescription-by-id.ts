"use server"

import ResponseError from "@/actions/response-error"
import { auth } from "@/auth"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { Prescription } from "@/interfaces/prescriptions"
import { PRESCRIPTIONS_GET_MINE_BY_ID } from "@/utils/api-urls"

interface GetMyPrescriptionById {
    id: string
}

export default async function getMyPrescriptionById({ id }: GetMyPrescriptionById) {
    const session = await auth()

    try {
        const URL = PRESCRIPTIONS_GET_MINE_BY_ID(id)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
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
