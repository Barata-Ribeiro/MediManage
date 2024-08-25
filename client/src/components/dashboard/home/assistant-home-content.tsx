import ConsultationsStats from "@/components/dashboard/home/consultations-stats"
import DividerWithContent from "@/components/helpers/divider-with-content"
import { FaCircleInfo, FaUserClock } from "react-icons/fa6"
import LatestNotice from "@/components/dashboard/home/latest-notice"
import { AssistantInfo } from "@/interfaces/home"
import TodayConsultationsStats from "@/components/dashboard/home/today-consultations-stats"
import TodayConsultationsList from "@/components/dashboard/home/today-consultations-list"

export default function AssistantHomeContent({ homeInfo }: Readonly<{ homeInfo: AssistantInfo }>) {
    return (
        <>
            <TodayConsultationsStats
                data={homeInfo.totalConsultationsForToday}
                totalData={homeInfo.consultationsByStatus}
            />
            <TodayConsultationsList data={homeInfo.consultationsForToday} />
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
            <ConsultationsStats data={homeInfo.consultationsByStatus} />
        </>
    )
}
