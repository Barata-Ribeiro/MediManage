"use server"

import { NOTICES_PUBLIC_GET_BY_ID } from "@/utils/api-urls"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import ResponseError from "@/actions/response-error"
import { Notice } from "@/interfaces/notices"

interface GetNoticeById {
    id: string
}

export default async function getPublicNoticeById({ id }: GetNoticeById) {
    try {
        const URL = NOTICES_PUBLIC_GET_BY_ID(id)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-cache",
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
