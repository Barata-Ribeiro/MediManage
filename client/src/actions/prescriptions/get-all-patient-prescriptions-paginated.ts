"use server"

import ResponseError from "@/actions/response-error"
import { PRESCRIPTIONS_GET_ALL_BY_PATIENT_ID } from "@/utils/api-urls"
import verifyAuthentication from "@/utils/verify-authentication"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { PaginatedSimplePrescriptions } from "@/interfaces/prescriptions"

export default async function getAllPatientPrescriptionsPaginated(
    patientId: string,
    page = 0,
    perPage = 10,
    direction = "ASC",
    orderBy = "createdAt",
) {
    const authToken = verifyAuthentication()
    try {
        const URL = PRESCRIPTIONS_GET_ALL_BY_PATIENT_ID(patientId, page, perPage, direction, orderBy)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken,
            },
            next: { revalidate: 30, tags: ["prescriptions"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as PaginatedSimplePrescriptions

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
