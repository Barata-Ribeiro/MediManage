"use client"

import NavigationPagination from "@/components/dashboard/filters/navigation-pagination"
import { useSession } from "next-auth/react"

interface PageInfo {
    size: number
    number: number
    totalElements: number
    totalPages: number
}

interface ArticlesListingProps {
    content: string[]
    pageInfo: PageInfo
}

export default function ArticlesListing({ content, pageInfo }: Readonly<ArticlesListingProps>) {
    const { data: session } = useSession()

    const isDoctor = session?.user?.accountType === "DOCTOR"
    const isAdministrator = session?.user?.accountType === "ADMINISTRATOR"

    return (
        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle">
                    <table className="min-w-full border-separate border-spacing-0"></table>
                    <NavigationPagination usePageInfo={pageInfo} contentSize={content.length} />
                </div>
            </div>
        </div>
    )
}
