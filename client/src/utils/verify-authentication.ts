import { cookies } from "next/headers"
import ResponseError from "@/actions/response-error"
import { tokenName } from "@/constants"

export default async function verifyAuthentication() {
    const authToken = cookies().get(tokenName)?.value
    if (!authToken) return ResponseError("You are not authenticated. Please sign in.")

    return authToken
}
