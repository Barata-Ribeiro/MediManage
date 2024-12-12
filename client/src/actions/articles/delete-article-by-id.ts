"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { ARTICLES_DELETE_BY_ID } from "@/utils/api-urls"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

interface DeleteArticleById {
    id: number
}

export default async function deleteArticleById({ id }: DeleteArticleById) {
    const session = await auth()

    try {
        const URL = ARTICLES_DELETE_BY_ID(id)

        const response = await fetch(URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        revalidateTag("context")
        revalidateTag("articles")

        return {
            ok: true,
            error: null,
            response: responseData,
        }
    } catch (error) {
        return ResponseError(error)
    }
}
