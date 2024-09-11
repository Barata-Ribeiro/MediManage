import type { Metadata } from "next"
import { Nunito, Roboto } from "next/font/google"
import "./globals.css"
import { type ReactNode } from "react"
import { UserContextProvider } from "@/context/user-context-provider"
import { User } from "@/interfaces/users"
import getUserContext from "@/actions/users/get-user-context"
import { twMerge } from "tailwind-merge"
import SimpleErrorNotification from "@/components/helpers/simple-error-notification"
import { CookieProvider } from "@/context/cookie-context-provider"
import getCookie from "@/actions/get-cookie"

const roboto = Roboto({
    weight: ["100", "300", "400", "500", "700", "900"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto",
})

const nunito = Nunito({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-nunito",
})

export const metadata: Metadata = {
    title: {
        default: "MediManage",
        template: "%s | MediManage",
    },
    description: "MediManage is a small clinic management system.",
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    const context = await getUserContext()
    let user: User | null = null
    if (context.ok) user = context.response?.data as User

    const fontVariables = `${roboto.variable} ${nunito.variable}`
    const bodyClasses = twMerge(fontVariables, "h-full")

    return (
        <html lang="en" className="h-full bg-neutral-200">
            <body className={bodyClasses}>
                <CookieProvider cookie={await getCookie()}>
                    <UserContextProvider user={user}>{children}</UserContextProvider>
                </CookieProvider>
                {context.error && <SimpleErrorNotification error={JSON.parse(JSON.stringify(context.error))} />}
            </body>
        </html>
    )
}
