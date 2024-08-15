"use server"

import { ApiResponse, ProblemDetails, State } from "@/interfaces/actions"
import ResponseError from "@/actions/response-error"
import verifyAuthentication from "@/utils/verify-authentication"
import { User } from "@/interfaces/users"
import { revalidateTag } from "next/cache"
import { USER_UPDATE_PROFILE_BY_ID } from "@/utils/api-urls"
import { z } from "zod"

const updateProfileSchema = z
    .object({
        username: z
            .string()
            .min(3, "Username must be at least 3 characters")
            .max(50, "Username must be at most 50 characters")
            .regex(/^[a-z]*$/, "Username must contain only lowercase letters")
            .nullish()
            .or(z.literal("")),
        email: z.string().email("Invalid email address").nullish().or(z.literal("")),
        fullName: z
            .string()
            .min(8, "Full name must be at least 8 characters")
            .max(100, "Full name must be at most 100 characters")
            .nullish()
            .or(z.literal("")),
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
        registrationNumber: z
            .string()
            .regex(/^\d{6}-\d{2}[A-Z]{2}$/)
            .nullish()
            .or(z.literal("")),
        registrationOrigin: z.string().nullish().or(z.literal("")),
        specialization: z.string().nullish().or(z.literal("")),
    })
    .transform(data => {
        if (data.username === "") delete data.username
        if (data.email === "") delete data.email
        if (data.fullName === "") delete data.fullName
        if (data.phone === "") delete data.phone
        if (data.address === "") delete data.address
        if (data.birthDate === "") delete data.birthDate
        if (data.registrationNumber === "") delete data.registrationNumber
        if (data.registrationOrigin === "") delete data.registrationOrigin
        if (data.specialization === "") delete data.specialization
    })

export default async function patchUpdateProfile(state: State, formData: FormData) {
    try {
        const id = formData.get("userId") as string
        if (!id) return ResponseError(new Error("User ID is required"))

        const URL = USER_UPDATE_PROFILE_BY_ID(id)

        const authToken = verifyAuthentication()

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = updateProfileSchema.safeParse(rawFormData)

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
