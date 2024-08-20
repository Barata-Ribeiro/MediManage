import ConsultationsStats from "@/components/dashboard/home/consultations-stats"
import { DoctorInfo } from "@/interfaces/home"
import DividerWithContent from "@/components/helpers/divider-with-content"
import { FaCircleInfo, FaUserClock } from "react-icons/fa6"
import LatestNotice from "@/components/dashboard/home/latest-notice"
import NextConsultation from "@/components/dashboard/home/next-consultation"

export default function DoctorHomeContent({ homeInfo }: Readonly<{ homeInfo: DoctorInfo }>) {
    return (
        <>
            <ConsultationsStats data={homeInfo.consultationsByStatus} />
            <DividerWithContent>
                <span className="bg-neutral-50 px-2 text-neutral-600">
                    <FaCircleInfo aria-hidden className="h-5 w-5 text-neutral-600" />
                </span>
            </DividerWithContent>
            <LatestNotice data={homeInfo.latestNotice} />
            <DividerWithContent>
                <span className="bg-neutral-50 px-2 text-neutral-600">
                    <FaUserClock aria-hidden className="h-5 w-5 text-neutral-600" />
                </span>
            </DividerWithContent>
            <NextConsultation data={homeInfo.nextConsultation} />
        </>
    )
}
