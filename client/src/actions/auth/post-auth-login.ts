"use server"

import { State } from "@/interfaces/actions"
import ResponseError from "@/actions/response-error"
import { z } from "zod"

const loginSchema = z.object({
    emailOrUsername: z.string({ message: "Email or Username is required" }).trim().min(3, "Username cannot be empty"),
    password: z.string({ message: "Password is required" }).min(8, "Password cannot be empty"),
    rememberMe: z.boolean().optional(),
})

export default async function postAuthLogin(state: State, formData: FormData) {
    try {
        const rawFormData = Object.fromEntries(formData.entries())
        console.log(rawFormData)

        const parsedFormData = loginSchema.safeParse(rawFormData)
        console.log(parsedFormData)

        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }

        return {
            ok: true,
            error: null,
            response: null,
        }
    } catch (error) {
        return ResponseError(error)
    }
}
