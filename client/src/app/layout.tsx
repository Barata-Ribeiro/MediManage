import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import { Nunito, Roboto } from "next/font/google"
import "./globals.css"
import { type ReactNode } from "react"
import { twMerge } from "tailwind-merge"

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
    const fontVariables = `${roboto.variable} ${nunito.variable}`
    const bodyClasses = twMerge(fontVariables, "h-full")

    return (
        <html lang="en" className="h-full bg-neutral-200">
            <body className={bodyClasses}>
                <SessionProvider>{children}</SessionProvider>
            </body>
        </html>
    )
}
