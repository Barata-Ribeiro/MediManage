import getUserContext from "@/actions/users/get-user-context"
import { auth, signOut } from "auth"
import type { Metadata } from "next"
import Link from "next/link"
import parseDate from "@/utils/parse-date"
import { notFound, redirect } from "next/navigation"
import { User } from "@/interfaces/users"

export const metadata: Metadata = {
    title: "Settings",
    description:
        "Settings page for your account. Your information will be displayed for your doctor and other healthcare providers.",
}

export default async function SettingsPage() {
    const session = await auth()
    if (!session) {
        await signOut({ redirect: false })
        return redirect("/auth/login")
    }

    const user = session.user as User
    if (!user) return notFound()

    const basePath = "/dashboard/" + user.username

    return (
        <section
            id="settings-section"
            aria-labelledby="settings-section-title"
            className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div>
                <h1 id="settings-section-title" className="text-base font-semibold leading-7 text-neutral-900">
                    Settings
                </h1>
                <p className="mt-1 text-sm leading-6 text-neutral-600">
                    This information will be displayed for your doctor and other healthcare providers.
                </p>

                <dl className="mt-6 space-y-6 divide-y divide-neutral-200 border-t border-neutral-200 text-sm leading-6">
                    <div className="pt-6 sm:flex">
                        <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">Username</dt>
                        <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                            <p className="text-neutral-900">{user.username}</p>
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
                            <Link
                                href={basePath + "/settings/edit"}
                                className="font-semibold text-indigo-600 hover:text-indigo-500">
                                Update
                            </Link>
                        </dd>
                    </div>
                    <div className="pt-6 sm:flex">
                        <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">Birth Date</dt>
                        <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                            <p className="text-neutral-900">
                                {user.birthDate ? (
                                    parseDate(user.birthDate)
                                ) : (
                                    <span className="text-neutral-500">Empty</span>
                                )}
                            </p>
                            <Link
                                href={basePath + "/settings/edit"}
                                className="font-semibold text-indigo-600 hover:text-indigo-500">
                                Update
                            </Link>
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
        </section>
    )
}
