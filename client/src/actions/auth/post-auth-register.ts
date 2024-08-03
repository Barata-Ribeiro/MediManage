"use server"

import { ApiResponse, ProblemDetails, State } from "@/interfaces/actions"
import ResponseError from "@/actions/response-error"
import { AUTH_REGISTER } from "@/utils/api-urls"
import { z } from "zod"
import { User } from "@/interfaces/users"
import { revalidateTag } from "next/cache"

const registerSchema = z
    .object({
        username: z
            .string({ message: "Username is required" })
            .trim()
            .min(3, "Username must be at least 3 characters")
            .max(50, "Username must be at most 50 characters")
            .regex(/^[a-z]*$/, "Username must contain only lowercase letters"),
        email: z.string({ message: "Email is required" }).trim().email("Invalid email address"),
        password: z
            .string({ message: "Password is required" })
            .trim()
            .min(8, "Password must be at least 8 characters")
            .max(100, "Password must be at most 100 characters")
            .regex(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/,
                "Password must contain at least one digit, one lowercase letter, " +
                    "one uppercase letter, one special character and no whitespace.",
            ),
        confirmPassword: z.string({ message: "Password confirmation is required" }).trim(),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "Passwords do not match",
                path: ["confirmPassword"],
            })
        }
    })

export default async function postAuthRegister(state: State, formData: FormData) {
    try {
        const URL = AUTH_REGISTER()

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = registerSchema.safeParse(rawFormData)

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
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const registerResponse = responseData.data as User

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
