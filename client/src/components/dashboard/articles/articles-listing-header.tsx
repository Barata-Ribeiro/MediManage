"use client"

import SearchFilter from "@/components/dashboard/filters/search-filter"
import { useUser } from "@/context/user-context-provider"

export default function ArticleListingHeader() {
    const { user } = useUser()

    const heading = user?.accountType === "DOCTOR" ? "Your Written Articles" : "Written Articles"
    const description =
        user?.accountType === "DOCTOR"
            ? "List all of your written articles in the system and manage them. These are the articles that you have written and published in the system and are available for the public to read, if the clinic made a public area for the articles."
            : "List and manage all of the written articles in the system. These are the articles that are written and published by doctors and are available for the public to read, if the clinic made a public area for the articles."

    return (
        <div className="flex flex-wrap items-center gap-4 md:justify-between">
            <div className="w-max flex-auto">
                <h1 id="medical-records-section-title" className="w-max text-base font-bold leading-6 text-neutral-900">
                    {heading}
                </h1>
                <p className="mt-2 max-w-xl text-sm text-neutral-700">{description}</p>
            </div>

            <SearchFilter />
        </div>
    )
}
