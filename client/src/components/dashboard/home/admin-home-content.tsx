import { AdministratorInfo } from "@/interfaces/home"
import ConsultationsStats from "@/components/dashboard/home/consultations-stats"
import UsersStats from "@/components/dashboard/home/users-stats"

export default function AdminHomeContent({ homeInfo }: Readonly<{ homeInfo: AdministratorInfo }>) {
    return (
        <>
            <ConsultationsStats data={homeInfo.consultationsByStatus} />
            <UsersStats data={homeInfo.allUsers} />
        </>
    )
}
