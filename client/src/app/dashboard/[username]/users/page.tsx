import getAllUsersPaginated from "@/actions/users/get-all-users-paginated"
import NavigationPagination from "@/components/dashboard/filters/navigation-pagination"
import UserFilter from "@/components/dashboard/filters/user-filter"
import StateError from "@/components/helpers/state-error"
import { ProblemDetails } from "@/interfaces/actions"
import { PaginatedUsers } from "@/interfaces/users"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FaPlus } from "react-icons/fa6"
import { twMerge } from "tailwind-merge"

export interface UsersPageProps {
    params: { username: string }
    searchParams?: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
    title: "System Users",
    description: "List all of the users in the system and manage their accounts.",
}

export default async function UsersPage({ params, searchParams }: Readonly<UsersPageProps>) {
    if (!params.username) return notFound()
    if (!searchParams) return null

    const page = parseInt(searchParams.page as string, 10) || 0
    const perPage = parseInt(searchParams.perPage as string, 10) || 10
    const type = (searchParams.type as string) || ""
    const direction = (searchParams.direction as string) || "ASC"
    const orderBy = (searchParams.orderBy as string) || "createdAt"

    const state = await getAllUsersPaginated(page, perPage, type, direction, orderBy)
    if (!state.ok) return <StateError error={state.error as ProblemDetails} />

    const pagination = state.response?.data as PaginatedUsers
    const content = pagination.content ?? []
    const pageInfo = pagination.page

    return (
        <section id="users-section" aria-labelledby="users-section-title" className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-4 md:justify-between">
                <div className="w-max flex-auto">
                    <h1 id="users-section-title" className="w-max text-base font-bold leading-6 text-neutral-900">
                        Users
                    </h1>
                    <p className="mt-2 max-w-xl text-sm text-neutral-700">
                        List all of the users in the system and manage their accounts. You can filter the list by
                        account type, direction, and order by.
                    </p>
                </div>
                <div className="grid w-max gap-4">
                    <UserFilter />

                    <Link
                        href={`/dashboard/${params.username}/users/register-employee`}
                        className="order-2 inline-flex w-max items-center gap-2 rounded-md bg-mourning-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-mourning-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mourning-blue-600 active:bg-mourning-blue-800 sm:order-1 sm:justify-self-end">
                        New Employee <FaPlus className="inline-block" />
                    </Link>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">
                                        Id
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 hidden border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-neutral-900 backdrop-blur backdrop-filter sm:table-cell">
                                        Username
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 hidden border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-neutral-900 backdrop-blur backdrop-filter lg:table-cell">
                                        Email
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-neutral-900 backdrop-blur backdrop-filter">
                                        Account Type
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-neutral-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8">
                                        <span className="sr-only">View/Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {content.length > 0 &&
                                    content.map((user, userIdx) => (
                                        <tr key={user.email}>
                                            <td
                                                className={twMerge(
                                                    userIdx !== content.length - 1 ? "border-b border-neutral-200" : "",
                                                    "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6 lg:pl-8",
                                                )}>
                                                {user.id}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    userIdx !== content.length - 1 ? "border-b border-neutral-200" : "",
                                                    "hidden whitespace-nowrap px-3 py-4 text-sm text-neutral-900 sm:table-cell",
                                                )}>
                                                {user.username}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    userIdx !== content.length - 1 ? "border-b border-neutral-200" : "",
                                                    "hidden whitespace-nowrap px-3 py-4 text-sm text-neutral-900 lg:table-cell",
                                                )}>
                                                {user.email}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    userIdx !== content.length - 1 ? "border-b border-neutral-200" : "",
                                                    "whitespace-nowrap px-3 py-4 text-sm text-neutral-900",
                                                )}>
                                                {user.accountType}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    userIdx !== content.length - 1 ? "border-b border-neutral-200" : "",
                                                    "relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-8 lg:pr-8",
                                                )}>
                                                <Link
                                                    href={`/dashboard/${params.username}/users/profile?id=${user.id}`}
                                                    className="text-mourning-blue-600 hover:text-mourning-blue-700 active:text-mourning-blue-800">
                                                    View<span className="sr-only">, {user.username}</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}

                                {content.length < 1 && (
                                    <tr className="border-b border-neutral-300 bg-white">
                                        <td
                                            colSpan={6}
                                            className="py-4 pl-4 pr-3 text-sm font-bold text-neutral-900 sm:pl-6 lg:pl-8">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <NavigationPagination usePageInfo={pageInfo} contentSize={content.length} />
                    </div>
                </div>
            </div>
        </section>
    )
}
