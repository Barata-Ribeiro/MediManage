import { cookies } from "next/headers"
import { tokenName } from "@/constants"

export default function verifyAuthentication() {
    const authToken = cookies().get(tokenName)?.value
    if (!authToken) throw new Error("You are not authenticated. Please sign in.")
    return authToken
}
