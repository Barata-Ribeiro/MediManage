"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { PaginatedSimpleArticles } from "@/interfaces/articles"
import { ARTICLES_GET_ALL_PAGINATED } from "@/utils/api-urls"
import { auth } from "auth"

interface GetAllArticlesPaginated {
    page: number
    perPage: number
    search: string | null
    category: string | null
    direction: string
    orderBy: string
}

export default async function getAllArticlesPaginated({
    page = 0,
    perPage = 10,
    search = null,
    category = null,
    direction = "DESC",
    orderBy = "createdAt",
}: GetAllArticlesPaginated) {
    const session = await auth()

    try {
        const URL = ARTICLES_GET_ALL_PAGINATED(page, perPage, search, category, direction, orderBy)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            next: { revalidate: 30, tags: ["articles"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as PaginatedSimpleArticles

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
