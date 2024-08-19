"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { FaHome } from "react-icons/fa"
import { FaChevronRight } from "react-icons/fa6"
import { twMerge } from "tailwind-merge"
import tw from "@/utils/tw"

export default function Breadcrumbs() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const home = pathname.split("/").slice(0, 3).join("/")
    const crumbs = pathname.split("/").slice(3)
    const existingParams = new URLSearchParams(searchParams).toString()
    const savedParams = `?${existingParams}`

    return (
        <nav className="mb-4 block" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
                {home && crumbs.length >= 1 && (
                    <li>
                        <Link href={home} className="text-neutral-400 hover:text-neutral-600 active:text-neutral-700">
                            <FaHome className="m-1 flex-shrink-0" size={16} aria-hidden="true" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </li>
                )}
                {crumbs.map((crumb, index) => {
                    const isLast = index === crumbs.length - 1
                    const isPrescription = crumb === "prescriptions"
                    const active = isLast
                        ? tw`font-bold text-hello-spring-600 hover:text-hello-spring-700 active:text-hello-spring-800`
                        : tw`font-semibold text-neutral-400 hover:text-neutral-600 active:text-neutral-700`
                    const sortedClasses = twMerge(active, "ml-2 text-sm font-heading capitalize")
                    const includeParams = isLast && existingParams ? savedParams : ""
                    return (
                        <li key={crumb + "_" + index}>
                            <div className="flex items-center">
                                <FaChevronRight
                                    className="m-1 flex-shrink-0 text-gray-400"
                                    size={12}
                                    aria-hidden="true"
                                />
                                <Link
                                    href={
                                        isPrescription
                                            ? `${home}/${crumbs.slice(0, index + 1).join("/")}${savedParams}`
                                            : `${home}/${crumbs.slice(0, index + 1).join("/")}${includeParams}`
                                    }
                                    className={sortedClasses}>
                                    {crumb}
                                </Link>
                            </div>
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
