"use client"

import ConsultationsStats from "@/components/dashboard/home/consultations-stats"
import LatestNotice from "@/components/dashboard/home/latest-notice"
import UsersStats from "@/components/dashboard/home/users-stats"
import DividerWithContent from "@/components/helpers/divider-with-content"
import { AdministratorInfo } from "@/interfaces/home"
import { FaCalendar, FaCircleInfo } from "react-icons/fa6"

export default function AdminHomeContent({ homeInfo }: Readonly<{ homeInfo: AdministratorInfo }>) {
    return (
        <>
            <UsersStats data={homeInfo.allUsers} />
            <DividerWithContent>
                <span className="bg-neutral-50 px-2 text-neutral-600">
                    <FaCircleInfo aria-hidden className="h-5 w-5 text-neutral-600" />
                </span>
            </DividerWithContent>
            <LatestNotice data={homeInfo.latestNotice} />
            <DividerWithContent>
                <span className="bg-neutral-50 px-2 text-neutral-600">
                    <FaCalendar aria-hidden className="h-5 w-5 text-neutral-600" />
                </span>
            </DividerWithContent>
            <ConsultationsStats data={homeInfo.consultationsByStatus} />
        </>
    )
}
