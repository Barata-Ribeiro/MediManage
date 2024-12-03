"use server"

import getAuthCookies from "@/utils/get-auth-cookies"
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies"
import { cookies } from "next/headers"

export default async function deleteSession() {
    const cookieStore = await getAuthCookies()

    if (cookieStore) {
        ;(cookieStore as RequestCookie[]).forEach(cookie => cookies().delete(cookie.name))
    }

    return {
        ok: true,
        message: "Session cookies deleted successfully",
    }
}
