"use server"

import { ApiResponse, ProblemDetails, State } from "@/interfaces/actions"
import ResponseError from "@/actions/response-error"
import { revalidateTag } from "next/cache"
import verifyAuthentication from "@/utils/verify-authentication"
import { USER_DELETE_PROFILE_BY_ID } from "@/utils/api-urls"

export default async function deleteUserProfile(state: State, formData: FormData) {
    try {
        const id = formData.get("userId") as string
        if (!id) return ResponseError(new Error("User ID is required"))

        const URL = USER_DELETE_PROFILE_BY_ID(id)

        const authToken = verifyAuthentication()

        const response = await fetch(URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken,
            },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        revalidateTag("users")
        revalidateTag("context")

        return {
            ok: true,
            error: null,
            response: { ...responseData },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
