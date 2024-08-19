import type { Metadata } from "next"
import getUserContext from "@/actions/users/get-user-context"
import { User } from "@/interfaces/users"
import getHomeInfo from "@/actions/get-home-info"
import { AdministratorInfo, AssistantInfo, DoctorInfo, PatientInfo } from "@/interfaces/home"
import ConsultationsStats from "@/components/dashboard/home/consultations-stats"
import LatestNotice from "@/components/dashboard/home/latest-notice"
import NextConsultation from "@/components/dashboard/home/next-consultation"
import { Fragment } from "react"
import { FaCircleInfo, FaUserClock } from "react-icons/fa6"
import DividerWithContent from "@/components/helpers/divider-with-content"

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
    return {
        title: params.username,
        description: "Dashboard from " + params.username,
    }
}

export default async function HomePage() {
    const userState = await getUserContext()
    const user = userState.response?.data as User

    const homeState = await getHomeInfo(user.accountType)
    const homeInfo = homeState.response as AdministratorInfo | PatientInfo | AssistantInfo | DoctorInfo

    console.log(homeInfo)

    return (
        <div className="grid gap-4">
            {user.accountType === "DOCTOR" && (
                <>
                    <ConsultationsStats data={(homeInfo as DoctorInfo).consultationsByStatus} />
                    <DividerWithContent>
                        <span className="bg-neutral-50 px-2 text-neutral-600">
                            <FaCircleInfo aria-hidden className="h-5 w-5 text-neutral-600" />
                        </span>
                    </DividerWithContent>
                    <LatestNotice data={(homeInfo as DoctorInfo).latestNotice} />
                    <DividerWithContent>
                        <span className="bg-neutral-50 px-2 text-neutral-600">
                            <FaUserClock aria-hidden className="h-5 w-5 text-neutral-600" />
                        </span>
                    </DividerWithContent>
                    <NextConsultation data={(homeInfo as DoctorInfo).nextConsultation} />
                </>
            )}
        </div>
    )
}
