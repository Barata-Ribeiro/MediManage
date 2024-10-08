"use client"

import { PatientInfo } from "@/interfaces/home"
import LatestNotice from "@/components/dashboard/home/latest-notice"
import { FaCircleInfo, FaUserClock } from "react-icons/fa6"
import DividerWithContent from "@/components/helpers/divider-with-content"
import { useUser } from "@/context/user-context-provider"
import MedicalRecordAndPrescription from "@/components/dashboard/home/medical-record-and-prescription"
import NextConsultation from "@/components/dashboard/home/next-consultation"

export default function PatientHomeContent({ homeInfo }: Readonly<{ homeInfo: PatientInfo }>) {
    const userData = useUser()
    if (!userData.user) return null

    return (
        <>
            <MedicalRecordAndPrescription
                medicalRecord={homeInfo.medicalRecord}
                prescription={homeInfo.latestPrescription}
                user={userData.user}
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
