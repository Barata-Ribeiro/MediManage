import { type ReactNode } from "react"
import Header from "@/components/dashboard/header"
import Footer from "@/components/dashboard/footer"

interface DashboardLayoutProps {
    children: ReactNode
    params: { username: string }
}

export default async function DashboardLayout({ children }: Readonly<DashboardLayoutProps>) {
    return (
        <div className="min-h-full">
            <Header />

            <main className="-mt-32">
                <section className="container px-4 pb-12 font-body sm:px-6 lg:px-8">{children}</section>
            </main>

            <Footer />
        </div>
    )
}
