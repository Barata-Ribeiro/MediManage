import { FaUserDoctor, FaUserInjured, FaUserTie } from "react-icons/fa6"
import Link from "next/link"
import { useUser } from "@/context/user-context-provider"

interface UsersStatsProps {
    data: Record<string, number>
}

export default function UsersStats({ data }: Readonly<UsersStatsProps>) {
    const dataUser = useUser()
    const dashboardUrl = "/dashboard/" + dataUser.user?.username

    const userTypeMapping = {
        doctors: { type: "Doctors", icon: FaUserDoctor },
        patients: { type: "Patients", icon: FaUserInjured },
        employees: { type: "Employees", icon: FaUserTie },
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
                {transformedData.data.map(({ id, type, total, icon: Icon }) => {
                    const userTypeUrl =
                        type === "Employees"
                            ? dashboardUrl + "/users"
                            : dashboardUrl + "/users?type=" + type.slice(0, -1).toUpperCase()
                    return (
                        <div
                            key={id}
                            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
                            <dt>
                                <div className="absolute rounded-md bg-mourning-blue-500 p-3">
                                    <Icon aria-hidden className="h-6 w-6 text-neutral-50" />
                                </div>
                                <p className="ml-16 truncate font-heading text-sm font-medium text-neutral-700">
                                    {type}
                                </p>
                            </dt>
                            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                                <p className="text-2xl font-semibold text-gray-900">{total}</p>
                                <p className="ml-2 flex items-baseline text-sm font-semibold text-neutral-500">
                                    of {transformedData.total}
                                </p>
                                <div className="absolute inset-x-0 bottom-0 bg-neutral-100 px-4 py-4 sm:px-6">
                                    <div className="text-sm">
                                        <Link
                                            href={userTypeUrl}
                                            className="font-medium text-mourning-blue-600 hover:text-mourning-blue-700 active:text-mourning-blue-800">
                                            View all<span className="sr-only">{type} users</span>
                                        </Link>
                                    </div>
                                </div>
                            </dd>
                        </div>
                    )
                })}
            </dl>
        </div>
    )
}
