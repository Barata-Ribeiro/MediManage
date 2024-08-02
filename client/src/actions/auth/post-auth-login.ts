"use server"

import { ApiResponse, ProblemDetails, State } from "@/interfaces/actions"
import ResponseError from "@/actions/response-error"
import { z } from "zod"
import { revalidateTag } from "next/cache"
import { LoginResponse } from "@/interfaces/auth"
import { cookies } from "next/headers"
import { AUTH_LOGIN } from "@/utils/api-urls"
import { tokenName } from "@/constants"

const loginSchema = z.object({
    emailOrUsername: z
        .string({ message: "Email/Username is required" })
        .trim()
        .min(3, "Email/Username cannot be empty"),
    password: z.string({ message: "Password is required" }).min(8, "Password cannot be empty"),
    rememberMe: z.preprocess(val => val === "on", z.boolean().optional()),
})

export default async function postAuthLogin(state: State, formData: FormData) {
    try {
        const URL = AUTH_LOGIN()
        const ONE_DAY = 24 * 60 * 60 * 1000
        const ONE_YEAR = 365 * ONE_DAY

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = loginSchema.safeParse(rawFormData)

        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }

        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parsedFormData.data),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(new Error(problemDetails.detail))
        }

        const responseData = json as ApiResponse

        const loginResponse = responseData.data as LoginResponse

        cookies().set(tokenName, loginResponse.token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            expires: Date.now() + (parsedFormData.data.rememberMe ? ONE_YEAR : ONE_DAY),
        })

        revalidateTag("context")

        return {
            ok: true,
            error: null,
            response: { ...responseData, loginResponse },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
