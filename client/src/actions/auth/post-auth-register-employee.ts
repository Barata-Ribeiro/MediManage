"use server"

import ResponseError from "@/actions/response-error"
import { auth } from "@/auth"
import { ApiResponse, ProblemDetails, State } from "@/interfaces/actions"
import { NewAccountResponse } from "@/interfaces/auth"
import { AUTH_REGISTER_NEW_EMPLOYEE } from "@/utils/api-urls"
import { revalidateTag } from "next/cache"
import { z } from "zod"

const newEmployeeSchema = z
    .object({
        fullName: z
            .string()
            .min(8, "Full name must be at least 8 characters")
            .max(100, "Full name must be at most 100 characters"),
        email: z.string().email("Invalid email address"),
        phone: z
            .string()
            .regex(
                /^(\+\d{1,3}( )?)?((\(\d{3}\))|\d{3})[- .]?\d{3}[- .]?\d{4}$/,
                "You must provide a valid phone number. Example: (123) 456-7890",
            ),
        address: z.string(),
        birthDate: z.string().date("Invalid date format"),
        registrationNumber: z
            .string()
            .regex(/^\d{6}-\d{2}\/[A-Z]{2}$/, "Invalid registration number. Example: 123456-78/AB")
            .nullish()
            .or(z.literal("")),
        registrationOrigin: z.string().min(3, "Registration Origin must not be empty").nullish().or(z.literal("")),
        specialization: z.string().min(3, "Specialization must not be empty").nullish().or(z.literal("")),
        accountType: z.enum(["ASSISTANT", "DOCTOR", "ADMINISTRATOR"]),
    })
    .transform((data, ctx) => {
        if (data.accountType === "DOCTOR") {
            if (data.registrationNumber === "" || data.registrationOrigin === "" || data.specialization === "") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Registration number, origin, and specialization are required for doctors.",
                })
            }
        } else {
            delete data.registrationNumber
            delete data.registrationOrigin
            delete data.specialization
        }
    })

export default async function postAuthRegisterEmployee(state: State, formData: FormData) {
    const session = await auth()

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
                authorization: "Bearer " + session?.accessToken,
            },
            body: JSON.stringify(parsedFormData.data),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const registerResponse = responseData.data as NewAccountResponse

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
