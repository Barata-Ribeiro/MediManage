import { cookies } from "next/headers"
import { tokenName } from "@/constants"

export default function verifyAuthentication() {
    const authToken = cookies().get(tokenName)?.value
    if (!authToken) {
        throw {
            type: "https://tools.ietf.org/html/rfc7235#section-4.1",
            title: "Authentication Error",
            status: 401,
            detail: "You are not authorized to access this resource.",
            instance: "https://tools.ietf.org/html/rfc7235#section-4.1",
        }
    }
    return authToken
}
