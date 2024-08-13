import type { Metadata } from "next"
import getUserContext from "@/actions/users/get-user-context"
import { User } from "@/interfaces/users"
import getHomeInfo from "@/actions/get-home-info"
import { AdministratorInfo, AssistantInfo, DoctorInfo, PatientInfo } from "@/interfaces/home"

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
        <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
            <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
                {user.accountType === "ASSISTANT" && (
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8">
                        <dt className="text-sm font-medium leading-6 text-gray-500">Consultations by Status</dt>
                        {Object.entries((homeInfo as AssistantInfo).consultationsByStatus).map(([status, count]) => (
                            <dd
                                key={status}
                                className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
                                {status}: {count}
                            </dd>
                        ))}
                    </div>
                )}
            </dl>
        </div>
    )
}
