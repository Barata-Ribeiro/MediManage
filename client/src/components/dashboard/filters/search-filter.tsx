"use client"

import tw from "@/utils/tw"
import { Button, Field, Input, Label, Select } from "@headlessui/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FaMagnifyingGlass, FaTrash } from "react-icons/fa6"
import { twMerge } from "tailwind-merge"

interface SearchFilterProps {
    allowSearch?: boolean
    allowCategory?: boolean
}

export default function SearchFilter({ allowSearch = true, allowCategory = false }: Readonly<SearchFilterProps>) {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(searchParams.get("search") ?? "")
    const [category, setCategory] = useState(searchParams.get("category") ?? "")
    const [direction, setDirection] = useState(searchParams.get("direction") ?? "")
    const [orderBy, setOrderBy] = useState(searchParams.get("orderBy") ?? "")

    useEffect(() => {
        const params = new URLSearchParams(searchParams)

        if (search) params.set("search", search)
        else params.delete("search")

        if (search) params.set("category", category)
        else params.delete("category")

        if (direction) params.set("direction", direction)
        else params.delete("direction")

        if (orderBy) params.set("orderBy", orderBy)
        else params.delete("orderBy")

        router.push(`?${params.toString()}`)
    }, [search, direction, orderBy, searchParams, router, category])

    function clearFilters() {
        setSearch("")
        setCategory("")
        setDirection("")
        setOrderBy("")
    }

    const labelStyles = tw`block text-sm font-semibold leading-6 text-neutral-900`
    const selectStyles = tw`mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-mourning-blue-600 sm:text-sm sm:leading-6`

    const isPrescriptionPath = pathname.includes("prescriptions")
    const isConsultationPath = pathname.includes("consultations")
    const isNoticePath = pathname.includes("notices")
    const isArticlePath = pathname.includes("articles")

    return (
        <div className="order-1 flex h-auto w-auto items-end gap-2 sm:order-2">
            <div className="order-1 flex flex-wrap justify-center gap-2 sm:order-2 sm:justify-normal">
                {allowSearch && (
                    <Field className="grid w-auto">
                        <Label className={labelStyles}>Search</Label>
                        <div className="relative mt-2 rounded-md">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <FaMagnifyingGlass aria-hidden="true" className="h-5 w-5 text-neutral-400" />
                            </div>
                            <Input
                                type="search"
                                name="search"
                                value={search}
                                className={twMerge(selectStyles, "mt-0 pl-10 pr-3")}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search..."
                            />
                        </div>
                    </Field>
                )}
                {allowCategory && (
                    <Field className="grid w-auto">
                        <Label className={labelStyles}>Category</Label>
                        <div className="relative mt-2 rounded-md">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <FaMagnifyingGlass aria-hidden="true" className="h-5 w-5 text-neutral-400" />
                            </div>
                            <Input
                                type="category"
                                name="category"
                                value={category}
                                className={twMerge(selectStyles, "mt-0 pl-10 pr-3")}
                                onChange={e => setCategory(e.target.value)}
                                placeholder="Type a category..."
                            />
                        </div>
                    </Field>
                )}
                <Field className="grid w-auto">
                    <Label className={labelStyles}>Direction</Label>
                    <Select
                        className={selectStyles}
                        name="direction"
                        value={direction}
                        onChange={e => setDirection(e.target.value)}>
                        <option value="ASC">Ascending</option>
                        <option value="DESC">Descending</option>
                    </Select>
                </Field>
                <Field className="grid w-auto">
                    <Label className={labelStyles}>Order By</Label>
                    <Select
                        className={selectStyles}
                        name="orderBy"
                        value={orderBy}
                        onChange={e => setOrderBy(e.target.value)}>
                        <option value="id">Id</option>
                        {isPrescriptionPath && <option value="doctor.fullName">Doctor&apos;s Name</option>}
                        {isConsultationPath && (
                            <>
                                <option value="scheduledTo">Scheduled To</option>
                                <option value="status">Status</option>
                            </>
                        )}
                        {isNoticePath && (
                            <>
                                <option value="title">Title</option>
                                <option value="type">Type</option>
                                <option value="status">Status</option>
                                <option value="issuer.username">Issuer</option>
                            </>
                        )}
                        {isArticlePath && (
                            <>
                                <option value="title">Title</option>
                                <option value="subTitle">Subtitle</option>
                                <option value="wasEdit">Was Edit?</option>
                                <option value="author.username">Author</option>
                            </>
                        )}
                        <option value="createdAt">Created At</option>
                        <option value="updatedAt">Updated At</option>
                    </Select>
                </Field>
            </div>
            <Button
                type="button"
                onClick={clearFilters}
                title="Clear Filters"
                className="h-max rounded-md bg-mourning-blue-600 p-2 hover:bg-mourning-blue-700 active:bg-mourning-blue-800">
                <span className="sr-only">Clear Filters</span>
                <FaTrash aria-hidden className="h-5 w-5 text-white" />
            </Button>
        </div>
    )
}
