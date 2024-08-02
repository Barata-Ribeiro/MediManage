import getUserContext from "@/actions/users/get-user-context"
import type { Metadata } from "next"
import Link from "next/link"
import parseDate from "@/utils/parse-date"
import { notFound } from "next/navigation"
import { User } from "@/interfaces/users"

export const metadata: Metadata = {
    title: "Settings",
    description:
        "Settings page for your account. Your information will be displayed for your doctor and other healthcare providers.",
}

export default async function SettingsPage() {
    const context = await getUserContext()
    const user = context.response?.data as User
    if (!user) return notFound()

    const basePath = "/dashboard/" + user.username

    return (
        <div className="h-full rounded-md bg-neutral-50 p-4 shadow-derek">
            <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
                <div>
                    <h2 className="text-base font-semibold leading-7 text-neutral-900">Settings</h2>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">
                        This information will be displayed for your doctor and other healthcare providers.
                    </p>

                    <dl className="mt-6 space-y-6 divide-y divide-neutral-200 border-t border-neutral-200 text-sm leading-6">
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">Username</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <p className="text-neutral-900">{user.username}</p>
                                <Link
                                    href={basePath + "/settings/edit"}
                                    className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Update
                                </Link>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">Full name</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <p className="text-neutral-900">
                                    {user.fullName ?? <span className="text-neutral-500">Empty</span>}
                                </p>
                                <Link
                                    href={basePath + "/settings/edit"}
                                    className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Update
                                </Link>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">Email address</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <p className="text-neutral-900">{user.email}</p>
                                <Link
                                    href={basePath + "/settings/edit"}
                                    className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Update
                                </Link>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">Address</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <p className="text-neutral-900">
                                    {user.address ?? <span className="text-neutral-500">Empty</span>}
                                </p>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">Birth Date</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <p className="text-neutral-900">
                                    {parseDate(user.birthDate) ?? <span className="text-neutral-500">Empty</span>}
                                </p>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">Account Type</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <p className="capitalize text-neutral-900">{user.accountType.toLowerCase()}</p>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">Registered At</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <p className="text-neutral-900">{parseDate(user.createdAt)}</p>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">Last Updated</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <p className="text-neutral-900">{parseDate(user.updatedAt)}</p>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    )
}
