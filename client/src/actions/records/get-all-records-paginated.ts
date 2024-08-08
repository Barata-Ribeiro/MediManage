"use server"

import { MEDICAL_RECORDS_GET_ALL } from "@/utils/api-urls"
import verifyAuthentication from "@/utils/verify-authentication"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import ResponseError from "@/actions/response-error"
import { PaginatedSimpleRecords } from "@/interfaces/records"

export async function getAllRecordsPaginated(
    page: number,
    perPage: number,
    search: string | null,
    direction: string,
    orderBy: string,
) {
    try {
        const URL = MEDICAL_RECORDS_GET_ALL(page, perPage, search, direction, orderBy)

        const authToken = verifyAuthentication()

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken,
            },
            next: { revalidate: 30, tags: ["medicalRecords"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as PaginatedSimpleRecords

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
