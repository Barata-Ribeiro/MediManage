import { Metadata } from "next"
import { notFound } from "next/navigation"
import { twMerge } from "tailwind-merge"
import Link from "next/link"
import getAllUsersPaginated from "@/actions/users/get-all-users-paginated"
import { PaginatedUsers } from "@/interfaces/users"
import { State } from "@/interfaces/actions"

interface UsersPageProps {
    params: { username: string }
    searchParams?: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
    title: "Users",
    description: "List and manage your content.",
}

export default async function UsersPage({ params, searchParams }: Readonly<UsersPageProps>) {
    if (!params.username || !searchParams) return notFound()

    let page: number
    let perPage: number
    let type: string
    let direction: string
    let orderBy: string

    let state: State | { ok: boolean; error: null; response: PaginatedUsers }

    if (searchParams) {
        page = parseInt(searchParams.page as string, 10) || 0
        perPage = parseInt(searchParams.perPage as string, 10) || 10
        type = (searchParams.type as string) || ""
        direction = (searchParams.direction as string) || "ASC"
        orderBy = (searchParams.orderBy as string) || "createdAt"

        state = await getAllUsersPaginated(page, perPage, type, direction, orderBy)
    } else state = await getAllUsersPaginated()

    const pagiantion = state.response as PaginatedUsers
    const content = pagiantion.content
    const pageInfo = pagiantion.page

    return (
        <div className="h-full rounded-md bg-neutral-50 p-4 shadow-derek">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">Users</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            A list of all the users in your account including their name, title, email and role.
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                            type="button"
                            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Add user
                        </button>
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
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">
                                            Id
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell">
                                            Username
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell">
                                            Email
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">
                                            Account Type
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {content.map((user, userIdx) => (
                                        <tr key={user.email}>
                                            <td
                                                className={twMerge(
                                                    userIdx !== content.length - 1 ? "border-b border-gray-200" : "",
                                                    "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8",
                                                )}>
                                                {user.id}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    userIdx !== content.length - 1 ? "border-b border-gray-200" : "",
                                                    "hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell",
                                                )}>
                                                {user.username}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    userIdx !== content.length - 1 ? "border-b border-gray-200" : "",
                                                    "hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell",
                                                )}>
                                                {user.email}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    userIdx !== content.length - 1 ? "border-b border-gray-200" : "",
                                                    "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
                                                )}>
                                                {user.accountType}
                                            </td>
                                            <td
                                                className={twMerge(
                                                    userIdx !== content.length - 1 ? "border-b border-gray-200" : "",
                                                    "relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-8 lg:pr-8",
                                                )}>
                                                <Link href="#" className="text-indigo-600 hover:text-indigo-900">
                                                    Edit<span className="sr-only">, {user.username}</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
