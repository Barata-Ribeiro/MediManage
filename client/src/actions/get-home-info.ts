"use server"

import ResponseError from "@/actions/response-error"
import {
    HOME_GET_ADMIN_INFO,
    HOME_GET_ASSISTANT_INFO,
    HOME_GET_DOCTOR_INFO,
    HOME_GET_PATIENT_INFO,
} from "@/utils/api-urls"
import verifyAuthentication from "@/utils/verify-authentication"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { AdministratorInfo, AssistantInfo, DoctorInfo, PatientInfo } from "@/interfaces/home"

export default async function getHomeInfo(accountType: string) {
    try {
        let URL
        switch (accountType) {
            case "ADMINISTRATOR":
                URL = HOME_GET_ADMIN_INFO()
                break
            case "ASSISTANT":
                URL = HOME_GET_ASSISTANT_INFO()
                break
            case "DOCTOR":
                URL = HOME_GET_DOCTOR_INFO()
                break
            default:
                URL = HOME_GET_PATIENT_INFO()
                break
        }

        const authToken = verifyAuthentication()

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken,
            },
            next: { revalidate: 30 },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as AdministratorInfo | PatientInfo | AssistantInfo | DoctorInfo

        return {
            ok: true,
            error: null,
            response: data,
        }
    } catch (error) {
        return ResponseError(error)
    }
}
