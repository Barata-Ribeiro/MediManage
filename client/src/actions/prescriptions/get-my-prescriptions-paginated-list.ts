"use server"

import ResponseError from "@/actions/response-error"
import { auth } from "@/auth"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { PaginatedSimplePrescriptions } from "@/interfaces/prescriptions"
import { PRESCRIPTIONS_GET_MY_PRESCRIPTIONS_PAGINATED_LIST } from "@/utils/api-urls"

export default async function getMyPrescriptionsPaginatedList(
    search: string | null,
    page = 0,
    perPage = 10,
    direction = "ASC",
    orderBy = "createdAt",
) {
    const session = await auth()

    try {
        const URL = PRESCRIPTIONS_GET_MY_PRESCRIPTIONS_PAGINATED_LIST(search, page, perPage, direction, orderBy)

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
