"use server"

import { ApiResponse, ProblemDetails, State } from "@/interfaces/actions"
import { AUTH_REGISTER_NEW_EMPLOYEE } from "@/utils/api-urls"
import ResponseError from "@/actions/response-error"
import { revalidateTag } from "next/cache"
import verifyAuthentication from "@/utils/verify-authentication"
import { z } from "zod"
import { NewEmployeeResponse } from "@/interfaces/auth"

const newEmployeeSchema = z.object({})

export default async function postAuthRegisterEmployee(state: State, formData: FormData) {
    const authToken = verifyAuthentication()

    try {
        const URL = AUTH_REGISTER_NEW_EMPLOYEE()

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = newEmployeeSchema.safeParse(rawFormData)

        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }

        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + authToken,
            },
            body: JSON.stringify(parsedFormData.data),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const registerResponse = responseData.data as NewEmployeeResponse

        revalidateTag("users")

        return {
            ok: true,
            error: null,
            response: { ...responseData, registerResponse },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
