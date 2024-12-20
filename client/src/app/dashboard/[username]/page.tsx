import getHomeInfo from "@/actions/get-home-info"
import AdminHomeContent from "@/components/dashboard/home/admin-home-content"
import AssistantHomeContent from "@/components/dashboard/home/assistant-home-content"
import DoctorHomeContent from "@/components/dashboard/home/doctor-home-content"
import PatientHomeContent from "@/components/dashboard/home/patient-home-content"
import { AdministratorInfo, AssistantInfo, DoctorInfo, PatientInfo } from "@/interfaces/home"
import { User } from "@/interfaces/users"
import { auth, signOut } from "auth"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
    return {
        title: params.username,
        description: "Dashboard from " + params.username,
    }
}

export default async function HomePage() {
    const session = await auth()
    if (!session) {
        await signOut({ redirect: false })
        return redirect("/auth/login")
    }

    const user = session.user as User

    const homeState = await getHomeInfo(user.accountType)
    const homeInfo = homeState.response as AdministratorInfo | PatientInfo | AssistantInfo | DoctorInfo

    return (
        <section id="home-section" className="grid gap-4">
            {user.accountType === "ADMINISTRATOR" && <AdminHomeContent homeInfo={homeInfo as AdministratorInfo} />}
            {user.accountType === "DOCTOR" && <DoctorHomeContent homeInfo={homeInfo as DoctorInfo} />}
            {user.accountType === "ASSISTANT" && <AssistantHomeContent homeInfo={homeInfo as AssistantInfo} />}
            {user.accountType === "PATIENT" && <PatientHomeContent homeInfo={homeInfo as PatientInfo} />}
        </section>
    )
}
