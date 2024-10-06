import { NextRequest, NextResponse } from "next/server"
import verifyToken from "@/utils/verify-token"
import decodeToken from "@/utils/decode-token"
import { tokenName } from "@/constants"

export async function middleware(request: NextRequest) {
    const authToken = request.cookies.get(tokenName)?.value
    const { pathname } = request.nextUrl
    const clonedUrl = request.nextUrl.clone()
    const isAuthenticated = authToken ? await verifyToken(authToken) : false

    if (!isAuthenticated && (clonedUrl.pathname === "/" || pathname.startsWith("/dashboard"))) {
        return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    if (isAuthenticated && (clonedUrl.pathname === "/" || pathname.startsWith("/auth"))) {
        const jwtPayload = await decodeToken(authToken)
        return NextResponse.redirect(new URL("/dashboard/" + jwtPayload.sub, request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
        "/dashboard/:path*",
        "/auth/:path*",
    ],
}
