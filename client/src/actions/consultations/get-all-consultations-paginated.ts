"use server"

import verifyAuthentication from "@/utils/verify-authentication"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import ResponseError from "@/actions/response-error"
import { CONSULTATIONS_GET_ALL } from "@/utils/api-urls"
import { PaginatedConsultations } from "@/interfaces/consultations"

export default async function getAllConsultationsPaginated(
    page = 0,
    perPage = 10,
    search: string | null = null,
    direction = "ASC",
    orderBy = "updatedAt",
) {
    const authToken = verifyAuthentication()
    try {
        const URL = CONSULTATIONS_GET_ALL(page, perPage, search, direction, orderBy)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken,
            },
            next: { revalidate: 30, tags: ["consultations"] },
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
