import { type ReactNode } from "react"
import Header from "@/components/dashboard/header"
import Footer from "@/components/dashboard/footer"
import Breadcrumbs from "@/components/breadcrumbs"

interface DashboardLayoutProps {
    children: ReactNode
    modal?: ReactNode
    params: { username: string }
}

export default async function DashboardLayout({ children, modal }: Readonly<DashboardLayoutProps>) {
    return (
        <div className="min-h-full">
            <Header />

            <div className="-mt-32">
                <div className="container px-4 pb-12 sm:px-6 lg:px-8">
                    <main className="h-full overflow-auto rounded-md bg-neutral-50 p-4 shadow-derek">
                        <Breadcrumbs />
                        {children}
                    </main>
                </div>
            </div>

            <Footer />
            {modal}
        </div>
    )
}
