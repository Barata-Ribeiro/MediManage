import { FaUserDoctor, FaUserInjured, FaUserTie } from "react-icons/fa6"

interface UsersStatsProps {
    data: Record<string, number>
}

export default function UsersStats({ data }: Readonly<UsersStatsProps>) {
    const userTypeMapping = {
        doctors: { type: "Doctor", icon: FaUserDoctor },
        patients: { type: "Patient", icon: FaUserInjured },
        employees: { type: "Employee", icon: FaUserTie },
    }

    function transformUserData(allUsers: Record<string, number>) {
        const { totalUsers, ...typeOfUsers } = allUsers

        return {
            total: totalUsers,
            data: Object.entries(typeOfUsers).map(([key, value], index) => {
                const { type, icon } = userTypeMapping[key as keyof typeof userTypeMapping]
                return {
                    id: index + 1,
                    type,
                    total: value,
                    icon,
                }
            }),
        }
    }

    const transformedData = transformUserData(data)

    return (
        <div>
            <h3 className="text-lg font-semibold leading-6 text-neutral-900">Users</h3>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {transformedData.data.map(({ id, type, total, icon: Icon }) => (
                    <div key={id} className="rounded-lg bg-white p-4 shadow">
                        <dt className="flex items-center text-sm font-medium text-neutral-600">
                            <Icon className="mr-2 h-5 w-5 text-neutral-400" />
                            {type}
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-neutral-900">
                            {total}
                            <span className="text-sm font-medium text-neutral-600"> / {transformedData.total}</span>
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}
