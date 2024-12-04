"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { FaArrowRightLong } from "react-icons/fa6"

export default function PatientListConsultationButton({ name }: Readonly<{ name: string }>) {
    const { data } = useSession()
    const encodedName = encodeURIComponent(name).replace(/%20/g, "+")
    const url = `/dashboard/${data?.user?.username}/consultations?search=${encodedName}`

    return (
        <Link
            href={url}
            className="order-2 inline-flex w-max items-center gap-2 whitespace-nowrap rounded-md bg-mourning-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-mourning-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-mourning-blue-800 sm:order-1 sm:justify-self-end">
            List Consultations <FaArrowRightLong className="inline-block" />
        </Link>
    )
}
