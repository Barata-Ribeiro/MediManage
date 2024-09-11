"use server"

import { cookies } from "next/headers"

export default async function getCookie() {
    return cookies().get("UAT")?.value
}
