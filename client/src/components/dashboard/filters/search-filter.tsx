"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Field, Input, Label, Select } from "@headlessui/react"
import tw from "@/utils/tw"

export default function SearchFilter() {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(searchParams.get("search") ?? "")
    const [direction, setDirection] = useState(searchParams.get("direction") ?? "")
    const [orderBy, setOrderBy] = useState(searchParams.get("orderBy") ?? "")

    useEffect(() => {
        const params = new URLSearchParams(searchParams)

        if (search) params.set("search", search)
        else params.delete("search")

        if (direction) params.set("direction", direction)
        else params.delete("direction")

        if (orderBy) params.set("orderBy", orderBy)
        else params.delete("orderBy")

        router.push(`?${params.toString()}`)
    }, [search, direction, orderBy, searchParams, router])

    const labelStyles = tw`block font-heading text-sm font-semibold leading-6 text-neutral-900`
    const selectStyles = tw`mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-neutral-900 ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-mourning-blue-600 sm:text-sm sm:leading-6`

    return (
        <div className="flex w-max flex-wrap justify-center gap-2 sm:justify-normal">
            <Field className="grid w-auto">
                <Label className={labelStyles}>Search</Label>
                <Input
                    type="search"
                    name="search"
                    value={search}
                    className={selectStyles}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search..."
                />
            </Field>
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
                    {pathname.includes("consultations") && <option value="scheduledTo">Scheduled To</option>}
                    <option value="createdAt">Created At</option>
                    <option value="updatedAt">Updated At</option>
                </Select>
            </Field>
        </div>
    )
}
