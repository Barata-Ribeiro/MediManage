"use client"

import tw from "@/utils/tw"
import { Button, Field, Label, Select } from "@headlessui/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FaTrash } from "react-icons/fa6"

export default function NotifFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [isRead, setIsRead] = useState(searchParams.get("isRead") ?? "")
    const [direction, setDirection] = useState(searchParams.get("direction") ?? "")
    const [orderBy, setOrderBy] = useState(searchParams.get("orderBy") ?? "")

    useEffect(() => {
        const params = new URLSearchParams(searchParams)

        if (isRead) params.set("isRead", isRead)
        else params.delete("isRead")

        if (direction) params.set("direction", direction)
        else params.delete("direction")

        if (orderBy) params.set("orderBy", orderBy)
        else params.delete("orderBy")

        router.push(`?${params.toString()}`)
    }, [isRead, direction, orderBy, searchParams, router])

    function clearFilters() {
        setIsRead("")
        setDirection("")
        setOrderBy("")
    }

    const labelStyles = tw`block text-sm font-semibold leading-6 text-neutral-900`
    const selectStyles = tw`mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-mourning-blue-600 sm:text-sm sm:leading-6`
    return (
        <div className="flex h-auto w-auto items-end gap-2">
            <div className="flex w-max flex-wrap justify-center gap-2 sm:justify-normal">
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
                        <option value="title">Title</option>
                        <option value="issuedAt">Issued At</option>
                        <option value="readAt">Read At</option>
                    </Select>
                </Field>
                <Field className="grid w-auto">
                    <Label className={labelStyles}>Is Read</Label>
                    <Select
                        className={selectStyles}
                        name="isRead"
                        value={isRead}
                        onChange={e => setIsRead(e.target.value)}>
                        <option value="">All</option>
                        <option value="true">Read</option>
                        <option value="false">Unread</option>
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
