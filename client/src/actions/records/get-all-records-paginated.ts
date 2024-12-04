"use server"

import ResponseError from "@/actions/response-error"
import { auth } from "@/auth"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { PaginatedSimpleRecords } from "@/interfaces/records"
import { MEDICAL_RECORDS_GET_ALL } from "@/utils/api-urls"

export async function getAllRecordsPaginated(
    page: number,
    perPage: number,
    search: string | null,
    direction: string,
    orderBy: string,
) {
    const session = await auth()
    try {
        const URL = MEDICAL_RECORDS_GET_ALL(page, perPage, search, direction, orderBy)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
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
