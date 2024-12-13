"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { Article } from "@/interfaces/articles"
import { ARTICLES_GET_PUBLIC_BY_ID } from "@/utils/api-urls"

interface GetPublicArticleById {
    id: number
}

export default async function getPublicArticleById({ id }: GetPublicArticleById) {
    try {
        const URL = ARTICLES_GET_PUBLIC_BY_ID(id)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 120, tags: ["article"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as Article

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
