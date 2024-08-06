"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Field, Label, Select } from "@headlessui/react"
import tw from "@/utils/tw"

export default function UserFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [type, setType] = useState(searchParams.get("type") ?? "")
    const [direction, setDirection] = useState(searchParams.get("direction") ?? "")
    const [orderBy, setOrderBy] = useState(searchParams.get("orderBy") ?? "")

    useEffect(() => {
        const params = new URLSearchParams(searchParams)

        if (type) params.set("type", type)
        else params.delete("type")

        if (direction) params.set("direction", direction)
        else params.delete("direction")

        if (orderBy) params.set("orderBy", orderBy)
        else params.delete("orderBy")

        router.push(`?${params.toString()}`)
    }, [type, direction, orderBy, searchParams, router])

    const labelStyles = tw`block font-heading text-sm font-semibold leading-6 text-neutral-900`
    const selectStyles = tw`mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-mourning-blue-600 sm:text-sm sm:leading-6`

    return (
        <div className="flex w-max flex-wrap justify-center gap-2 sm:justify-normal">
            <Field className="grid w-auto">
                <Label className={labelStyles}>Account Type</Label>
                <Select className={selectStyles} name="type" value={type} onChange={e => setType(e.target.value)}>
                    <option value="">All</option>
                    <option value="ADMINISTRATOR">Administrator</option>
                    <option value="DOCTOR">Doctor</option>
                    <option value="ASSISTANT">Assistant</option>
                    <option value="PATIENT">Patient</option>
                </Select>
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
                    <option value="createdAt">Created At</option>
                    <option value="updatedAt">Updated At</option>
                    <option value="username">Username</option>
                    <option value="email">Email</option>
                </Select>
            </Field>
        </div>
    )
}
