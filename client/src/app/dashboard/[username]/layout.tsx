import { type ReactNode } from "react"
import getUserContext from "@/actions/users/get-user-context"
import { notFound } from "next/navigation"

interface DashboardLayoutProps {
    children: ReactNode
    params: { username: string }
}

export async function generateMetadata({ params }: DashboardLayoutProps) {
    return {
        title: params.username,
        description: "Dashboard from " + params.username,
    }
}

export default async function DashboardLayout({ children }: Readonly<DashboardLayoutProps>) {
    const state = await getUserContext()
    const user = state.response?.data
    if (!user) return notFound()

    return (
        <>
            <h1>Welcome, {user.username}!</h1>
            {children}
        </>
    )
}
