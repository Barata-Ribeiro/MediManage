import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone()
    if (url.pathname === "/") {
        url.pathname = "/c"
        return NextResponse.redirect(url)
    }
}

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
}
