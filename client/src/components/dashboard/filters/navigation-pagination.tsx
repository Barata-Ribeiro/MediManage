"use client"

import tw from "@/utils/tw"
import { useRouter, useSearchParams } from "next/navigation"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"

interface NavigationPaginationProps {
    usePageInfo: {
        size: number
        number: number
        totalElements: number
        totalPages: number
    }
    contentSize: number
}

export default function NavigationPagination({ usePageInfo, contentSize }: Readonly<NavigationPaginationProps>) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const page = usePageInfo.number ?? parseInt(searchParams.get("page") as string, 10)

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        if (page) params.set("page", page.toString())
        else params.delete("page")

        router.push(`?${params.toString()}`)
    }

    const pageButtonStyles = tw`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50`

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 0}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                    Previous
                </button>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= usePageInfo.totalPages - 1}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                    Next
                </button>
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{contentSize > 0 ? contentSize : 0}</span> to{" "}
                        <span className="font-medium">{usePageInfo.size}</span> of{" "}
                        <span className="font-medium">{usePageInfo.totalElements}</span> results
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page <= 0}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                            <span className="sr-only">Previous</span>
                            <FaChevronLeft className="m-1" size={12} aria-hidden="true" />
                        </button>
                        {usePageInfo.totalPages > 1 &&
                            [...Array(usePageInfo.totalPages)].map((_, index) => {
                                if (
                                    usePageInfo.totalPages <= 4 ||
                                    index === 0 ||
                                    index === usePageInfo.totalPages - 1 ||
                                    Math.abs(page - index) <= 1
                                ) {
                                    return (
                                        <button
                                            key={"button-" + index + 1}
                                            type="button"
                                            onClick={() => handlePageChange(index)}
                                            className={pageButtonStyles}>
                                            {index + 1}
                                        </button>
                                    )
                                } else if (index === page - 2 || index === page + 2) {
                                    return (
                                        <button
                                            key={"button-" + index}
                                            type="button"
                                            className={pageButtonStyles}
                                            disabled>
                                            ...
                                        </button>
                                    )
                                }
                                return null
                            })}
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= usePageInfo.totalPages - 1}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                            <span className="sr-only">Next</span>
                            <FaChevronRight className="m-1" size={12} aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    )
}
