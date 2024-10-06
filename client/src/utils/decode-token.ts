import { AuthToken } from "@/interfaces/auth"
import { jwtVerify } from "jose"

export default async function decodeToken(token: string | undefined) {
    if (!token) throw new Error("No token provided.")
    if (token.length < 10) throw new Error("Token is invalid.")

    try {
        const secret_key = new TextEncoder().encode(process.env.JWT_BACKEND_SECRET)
        const { payload } = await jwtVerify(token, secret_key, { algorithms: ["HS256"] })
        return payload as unknown as AuthToken
    } catch (error) {
        console.error(error)
        throw new Error("Something went wrong. Please try again.")
    }
}
