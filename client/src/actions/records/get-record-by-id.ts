"use server"

import ResponseError from "@/actions/response-error"
import { auth } from "@/auth"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { MedicalRecord } from "@/interfaces/records"
import { MEDICAL_RECORDS_GET_BY_ID } from "@/utils/api-urls"

export default async function getRecordById(id: string) {
    const session = await auth()
    try {
        const URL = MEDICAL_RECORDS_GET_BY_ID(id)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            next: { revalidate: 60, tags: ["medicalRecord"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as MedicalRecord

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
