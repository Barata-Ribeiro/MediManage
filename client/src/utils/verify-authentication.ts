import { cookies } from "next/headers"
import { tokenName } from "@/constants"
import ResponseError from "@/actions/response-error"

export default function verifyAuthentication() {
    const authToken = cookies().get(tokenName)?.value
    if (!authToken) return ResponseError(new Error("You are not authenticated. Please sign in."))
    return authToken
}
