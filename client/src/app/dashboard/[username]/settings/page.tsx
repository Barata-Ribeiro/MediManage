import getUserContext from "@/actions/users/get-user-context"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Settings",
    description:
        "Settings page for your account. Your information will be displayed for your doctor and other healthcare providers.",
}

export default async function SettingsPage() {
    const context = await getUserContext()
    const user = context.response.data

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
                                <div className="text-neutral-900">{user.username}</div>
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
                                <div className="text-neutral-900">{user.fullName ?? "Empty"}</div>
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
                                <div className="text-neutral-900">{user.email}</div>
                                <Link
                                    href={basePath + "/settings/edit"}
                                    className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Update
                                </Link>
                            </dd>
                        </div>
                        <div className="pt-6 sm:flex">
                            <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">Account</dt>
                            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                <div className="capitalize text-neutral-900">{user.accountType.toLowerCase()}</div>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    )
}
