import { auth } from "auth"
import { NextRequest, NextResponse } from "next/server"

export default auth((request: NextRequest) => {
    // @ts-expect-error `auth` is added to the request object by the `auth` middleware
    const { auth } = request
    const { pathname } = request.nextUrl
    const isAuthenticated = !!auth && !auth.error

    if (!isAuthenticated && (pathname === "/" || pathname.startsWith("/dashboard"))) {
        const loginUrl = new URL("/auth/login", request.nextUrl)
        loginUrl.searchParams.set("callbackUrl", request.nextUrl.href)
        return NextResponse.redirect(loginUrl)
    }

    if (isAuthenticated && (pathname === "/" || pathname.startsWith("/auth"))) {
        return NextResponse.redirect(new URL("/dashboard/" + auth.user.username, request.nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/((?!api|trpc|_next/static|_next/image|favicon.ico).*)",
        "/dashboard/:path*",
        "/auth/:path*",
    ],
}
