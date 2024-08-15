import { type ReactNode } from "react"
import Header from "@/components/dashboard/header"
import Footer from "@/components/dashboard/footer"
import Breadcrumbs from "@/components/breadcrumbs"

interface DashboardLayoutProps {
    children: ReactNode
    params: { username: string }
}

export default async function DashboardLayout({ children }: Readonly<DashboardLayoutProps>) {
    return (
        <div className="min-h-full">
            <Header />

            <main className="-mt-32">
                <div className="container px-4 pb-12 font-body sm:px-6 lg:px-8">
                    <section className="h-full overflow-auto rounded-md bg-neutral-50 p-4 shadow-derek">
                        <Breadcrumbs />
                        {children}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}
