"use client"

import { PatientInfo } from "@/interfaces/home"
import LatestNotice from "@/components/dashboard/home/latest-notice"
import { FaCircleInfo } from "react-icons/fa6"
import DividerWithContent from "@/components/helpers/divider-with-content"
import { useUser } from "@/context/user-context-provider"
import MedicalRecordAndPrescription from "@/components/dashboard/home/medical-record-and-prescription"

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
                    <FaCircleInfo aria-hidden className="h-5 w-5 text-neutral-600" />
                </span>
            </DividerWithContent>
            <LatestNotice data={homeInfo.latestNotice} />
        </>
    )
}
