import { AdministratorInfo } from "@/interfaces/home"
import ConsultationsStats from "@/components/dashboard/home/consultations-stats"
import UsersStats from "@/components/dashboard/home/users-stats"
import { FaCalendar, FaCircleInfo } from "react-icons/fa6"
import DividerWithContent from "@/components/helpers/divider-with-content"
import LatestNotice from "@/components/dashboard/home/latest-notice"

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
