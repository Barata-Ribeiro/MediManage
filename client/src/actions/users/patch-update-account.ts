"use server"

import { ApiResponse, ProblemDetails, State } from "@/interfaces/actions"
import { USER_UPDATE_ACCOUNT } from "@/utils/api-urls"
import verifyAuthentication from "@/utils/verify-authentication"
import ResponseError from "@/actions/response-error"
import { z } from "zod"
import { User } from "@/interfaces/users"
import { revalidateTag } from "next/cache"

const updateAccountSchema = z
    .object({
        currentPassword: z.string({ message: "Current password is required" }),
        email: z.string().email("Invalid email address").nullish().or(z.literal("")),
        fullName: z
            .string()
            .min(8, "Full name must be at least 8 characters")
            .max(100, "Full name must be at most 100 characters")
            .nullish()
            .or(z.literal("")),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(100, "Password must be at most 100 characters")
            .regex(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/,
                "Password must contain at least one digit, one lowercase letter, " +
                    "one uppercase letter, one special character and no whitespace.",
            )
            .nullish()
            .or(z.literal("")),
        confirmNewPassword: z.string().optional().or(z.literal("")),
        phone: z
            .string()
            .regex(
                /^(\+\d{1,3}( )?)?((\(\d{3}\))|\d{3})[- .]?\d{3}[- .]?\d{4}$/,
                "You must provide a valid phone number.",
            )
            .nullish()
            .or(z.literal("")),
        address: z.string().nullish().or(z.literal("")),
        birthDate: z.string().date("Invalid date format").nullish().or(z.literal("")),
    })
    .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
        if (newPassword && newPassword !== confirmNewPassword) {
            ctx.addIssue({
                code: "custom",
                message: "Passwords do not match",
                path: ["confirmNewPassword"],
            })
        }
    })
    .transform(data => {
        if (data.newPassword === "") delete data.newPassword
        if (data.confirmNewPassword === "") delete data.confirmNewPassword
        if (data.address === "") delete data.address
        if (data.birthDate === "") delete data.birthDate
        if (data.email === "") delete data.email
        if (data.fullName === "") delete data.fullName
        if (data.phone === "") delete data.phone
        return data
    })

export default async function patchUpdateAccount(state: State, formData: FormData) {
    const authToken = verifyAuthentication()
    try {
        const URL = USER_UPDATE_ACCOUNT()

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = updateAccountSchema.safeParse(rawFormData)

        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }

        const response = await fetch(URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken,
            },
            body: JSON.stringify(parsedFormData.data),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const updateAccountResponse = responseData.data as User

        revalidateTag("users")
        revalidateTag("context")

        return {
            ok: true,
            error: null,
            response: { ...responseData, updateAccountResponse },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
