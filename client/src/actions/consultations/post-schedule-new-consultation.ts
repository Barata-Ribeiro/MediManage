"use server"

import { auth } from "@/auth"
import { ApiResponse, ProblemDetails, State } from "@/interfaces/actions"
import { Consultation } from "@/interfaces/consultations"
import { CONSULTATION_CREATE } from "@/utils/api-urls"
import { revalidateTag } from "next/cache"
import { z } from "zod"
import ResponseError from "../response-error"

const consultationSchema = z.object({
    "patient[fullName]": z
        .string({ message: "Patient Full Name is required" })
        .min(3, "Patient Full Name cannot be empty"),
    "doctor[fullName]": z
        .string({ message: "Doctor Full Name is required" })
        .min(3, "Doctor Full Name cannot be empty"),
    scheduledTo: z
        .string({ message: "Scheduled To is required" })
        .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Date is invalid"),
})

export default async function postScheduleNewConsultation(state: State, formData: FormData) {
    const session = await auth()
    try {
        const URL = CONSULTATION_CREATE()

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = consultationSchema.safeParse(rawFormData)

        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }

        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            body: JSON.stringify({
                patientFullName: parsedFormData.data["patient[fullName]"],
                doctorFullName: parsedFormData.data["doctor[fullName]"],
                scheduledTo: parsedFormData.data.scheduledTo,
            }),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const updateAccountResponse = responseData.data as Consultation

        revalidateTag("consultations")

        return {
            ok: true,
            error: null,
            response: { ...responseData, updateAccountResponse },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
