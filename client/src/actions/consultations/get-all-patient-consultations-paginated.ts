"use server"

import ResponseError from "@/actions/response-error"
import { auth } from "@/auth"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { PaginatedConsultations } from "@/interfaces/consultations"
import { CONSULTATIONS_GET_BY_PATIENT_ID } from "@/utils/api-urls"

export default async function getAllPatientConsultationsPaginated(
    id: string,
    page = 0,
    perPage = 10,
    direction = "ASC",
    orderBy = "updatedAt",
) {
    const session = await auth()
    try {
        const URL = CONSULTATIONS_GET_BY_PATIENT_ID(id, page, perPage, direction, orderBy)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            next: { revalidate: 60, tags: ["consultations"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as PaginatedConsultations

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
