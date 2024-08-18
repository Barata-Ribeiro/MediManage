"use server"

import { ApiResponse, ProblemDetails, State } from "@/interfaces/actions"
import ResponseError from "@/actions/response-error"
import verifyAuthentication from "@/utils/verify-authentication"
import { z } from "zod"
import { PRESCRIPTION_CREATE } from "@/utils/api-urls"

const prescriptionSchema = z.object({
    userId: z.string().uuid(),
    content: z.string().trim().min(50, "Prescription text must be at least 50 characters"),
})

export default async function postNewPrescription(state: State, formData: FormData) {
    try {
        const authToken = verifyAuthentication()

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = prescriptionSchema.safeParse(rawFormData)

        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }

        const URL = PRESCRIPTION_CREATE(parsedFormData.data.userId)

        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken,
            },
            body: JSON.stringify({ text: parsedFormData.data.content }),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
