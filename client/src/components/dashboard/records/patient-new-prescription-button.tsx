"use client"

import { FaPlus } from "react-icons/fa6"
import Link from "next/link"
import { useUser } from "@/context/user-context-provider"

export default function PatientNewPrescriptionButton({ userId }: Readonly<{ userId: string }>) {
    const data = useUser()
    const url = `/dashboard/${data?.user?.username}/records/prescriptions/new?user=${userId}`

    return (
        <Link
            href={url}
            className="order-2 inline-flex w-max items-center gap-2 whitespace-nowrap rounded-md bg-mourning-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-mourning-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-mourning-blue-800 sm:order-1 sm:justify-self-end">
            New Prescription <FaPlus className="inline-block" />
        </Link>
    )
}
