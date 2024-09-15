import type { Metadata } from "next"
import getUserContext from "@/actions/users/get-user-context"
import { User } from "@/interfaces/users"
import getHomeInfo from "@/actions/get-home-info"
import { AdministratorInfo, AssistantInfo, DoctorInfo, PatientInfo } from "@/interfaces/home"
import DoctorHomeContent from "@/components/dashboard/home/doctor-home-content"
import AdminHomeContent from "@/components/dashboard/home/admin-home-content"
import AssistantHomeContent from "@/components/dashboard/home/assistant-home-content"
import PatientHomeContent from "@/components/dashboard/home/patient-home-content"

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

    console.log("HOME INFO: ", homeInfo)

    return (
        <section id="home-section" className="grid gap-4">
            {user.accountType === "ADMINISTRATOR" && <AdminHomeContent homeInfo={homeInfo as AdministratorInfo} />}
            {user.accountType === "DOCTOR" && <DoctorHomeContent homeInfo={homeInfo as DoctorInfo} />}
            {user.accountType === "ASSISTANT" && <AssistantHomeContent homeInfo={homeInfo as AssistantInfo} />}
            {user.accountType === "PATIENT" && <PatientHomeContent homeInfo={homeInfo as PatientInfo} />}
        </section>
    )
}
