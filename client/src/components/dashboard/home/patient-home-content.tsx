"use client"

import LatestNotice from "@/components/dashboard/home/latest-notice"
import MedicalRecordAndPrescription from "@/components/dashboard/home/medical-record-and-prescription"
import NextConsultation from "@/components/dashboard/home/next-consultation"
import DividerWithContent from "@/components/helpers/divider-with-content"
import { PatientInfo } from "@/interfaces/home"
import { User } from "@/interfaces/users"
import { useSession } from "next-auth/react"
import { FaCircleInfo, FaUserClock } from "react-icons/fa6"

export default function PatientHomeContent({ homeInfo }: Readonly<{ homeInfo: PatientInfo }>) {
    const { data: session } = useSession()

    return (
        <>
            <MedicalRecordAndPrescription
                medicalRecord={homeInfo.medicalRecord}
                prescription={homeInfo.latestPrescription}
                user={session?.user as User}
            />
            <DividerWithContent>
                <span className="bg-neutral-50 px-2 text-neutral-600">
                    <FaUserClock aria-hidden className="h-5 w-5 text-neutral-600" />
                </span>
            </DividerWithContent>
            <NextConsultation data={homeInfo.nextConsultation} />
            <DividerWithContent>
                <span className="bg-neutral-50 px-2 text-neutral-600">
                    <FaCircleInfo aria-hidden className="h-5 w-5 bg-neutral-50 text-neutral-600" />
                </span>
            </DividerWithContent>
            <LatestNotice data={homeInfo.latestNotice} />
        </>
    )
}
