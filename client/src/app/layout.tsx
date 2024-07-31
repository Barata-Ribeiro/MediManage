import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { type ReactNode } from "react"
import { UserContextProvider } from "@/context/user-context-provider"
import { User } from "@/interfaces/users"
import getUserContext from "@/actions/users/get-user-context"

const inter = Inter({ subsets: ["latin"] })

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
    if (context.ok) user = context.response?.data

    return (
        <html lang="en">
            <body className={inter.className}>
                <UserContextProvider user={user}>{children}</UserContextProvider>
            </body>
        </html>
    )
}
