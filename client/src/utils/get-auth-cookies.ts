import { cookies } from "next/headers"

export default async function getAuthCookies() {
    const cookieData = cookies().getAll()
    return new Promise(resolve =>
        setTimeout(() => {
            resolve(cookieData)
        }, 500),
    )
}
