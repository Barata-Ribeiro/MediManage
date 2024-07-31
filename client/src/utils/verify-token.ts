import { jwtVerify } from "jose"

export default async function verifyToken(token: string): Promise<boolean> {
    if (!token) return false
    if (token.length < 10) return false

    try {
        const secret_key = new TextEncoder().encode(process.env.JWT_BACKEND_SECRET)
        if (!secret_key) return false

        await jwtVerify(token, secret_key, { algorithms: ["HS256"] })

        return true
    } catch (error) {
        return false
    }
}
