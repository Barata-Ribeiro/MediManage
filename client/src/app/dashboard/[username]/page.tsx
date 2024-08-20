import type { Metadata } from "next"
import getUserContext from "@/actions/users/get-user-context"
import { User } from "@/interfaces/users"
import getHomeInfo from "@/actions/get-home-info"
import { AdministratorInfo, AssistantInfo, DoctorInfo, PatientInfo } from "@/interfaces/home"
import DoctorHomeContent from "@/components/dashboard/home/doctor-home-content"

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
            {user.accountType === "DOCTOR" && <DoctorHomeContent homeInfo={homeInfo as DoctorInfo} />}
        </div>
    )
}
