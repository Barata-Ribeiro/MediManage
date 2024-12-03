"use server"

import ResponseError from "@/actions/response-error"
import { signIn } from "@/auth"
import { State } from "@/interfaces/actions"
import { z } from "zod"

const loginSchema = z.object({
    emailOrUsername: z
        .string({ message: "Email/Username is required" })
        .trim()
        .min(3, "Email/Username cannot be empty"),
    password: z.string({ message: "Password is required" }).min(8, "Password cannot be empty"),
    rememberMe: z.preprocess(val => val === "on", z.boolean().optional()),
})

export default async function postAuthLogin(state: State, formData: FormData) {
    try {
        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = loginSchema.safeParse(rawFormData)

        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }

        const response = await signIn("credentials", {
            username: parsedFormData.data.emailOrUsername,
            password: parsedFormData.data.password,
            rememberMe: parsedFormData.data.rememberMe,
            redirect: false,
        })

        return {
            ok: !response.error,
            error: response.error,
            response: null,
        }
    } catch (error) {
        console.log("CALLBACK ERROR: ", error)
        return ResponseError(error)
    }
}
