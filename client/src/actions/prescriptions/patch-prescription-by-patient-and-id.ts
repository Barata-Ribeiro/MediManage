"use server"

import { PRESCRIPTION_UPDATE_BY_PATIENT_AND_ID } from "@/utils/api-urls"
import verifyAuthentication from "@/utils/verify-authentication"
import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails, State } from "@/interfaces/actions"
import { z } from "zod"
import { Prescription } from "@/interfaces/prescriptions"

const prescriptionSchema = z.object({
    presId: z.string({ message: "Prescription ID is required." }),
    patientUsername: z.string({ message: "Patient username is required." }),
    content: z.string().trim().min(50, "Prescription text must be at least 50 characters"),
})

export default async function patchPrescriptionByPatientAndId(state: State, formData: FormData) {
    const authToken = verifyAuthentication()

    try {
        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = prescriptionSchema.safeParse(rawFormData)

        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }

        const URL = PRESCRIPTION_UPDATE_BY_PATIENT_AND_ID(
            parsedFormData.data.presId,
            parsedFormData.data.patientUsername,
        )

        const response = await fetch(URL, {
            method: "PATCH",
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

        const data = responseData.data as Prescription

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
