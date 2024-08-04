import { UsersPageProps } from "@/app/dashboard/[username]/users/page"
import { notFound } from "next/navigation"
import getUserProfileById from "@/actions/users/get-user-profile-by-id"
import { User } from "@/interfaces/users"
import { Metadata } from "next"
import { Button, Field, Input, Label, Select } from "@headlessui/react"

export async function generateMetadata({ searchParams }: Readonly<UsersPageProps>): Promise<Metadata> {
    if (!searchParams?.id) return notFound()
    const state = await getUserProfileById(searchParams.id.toString())
    const user = state.response?.data as User

    return {
        title: `Profile of ${user.username}`,
        description: `These are the details of the user with the username ${user.username}.`,
    }
}

export default async function ViewProfilePage({ params, searchParams }: Readonly<UsersPageProps>) {
    if (!params.username || !searchParams?.id) return notFound()

    const state = await getUserProfileById(searchParams.id.toString())
    const user = state.response?.data as User

    return (
        <div className="divide-y divide-neutral-900/5">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                    <h2 className="text-base font-semibold leading-7 text-neutral-900">Account</h2>
                    <p className="mt-1 text-sm leading-6 text-neutral-700">
                        Change this user&apos;s account vital information.
                    </p>
                </div>

                <form id="account-vital" className="md:col-span-2">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                        <Field className="col-span-full">
                            <Label
                                htmlFor="username"
                                className="block text-sm font-semibold leading-6 text-neutral-900">
                                Username
                            </Label>
                            <div className="mt-2">
                                <Input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </Field>

                        <Field className="col-span-full">
                            <Label htmlFor="email" className="block text-sm font-semibold leading-6 text-neutral-900">
                                Email
                            </Label>
                            <div className="mt-2">
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </Field>

                        <Field className="col-span-full">
                            <Label
                                htmlFor="accountType"
                                className="block text-sm font-semibold leading-6 text-neutral-900">
                                Account Type
                            </Label>
                            <div className="mt-2">
                                <Select
                                    name="accountType"
                                    aria-label="Account Type"
                                    className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6">
                                    <option value="" selected disabled hidden>
                                        Select Type
                                    </option>
                                    <option value="ADMINISTRATOR">Administrator</option>
                                    <option value="DOCTOR">Doctor</option>
                                    <option value="ASSISTANT">Assistant</option>
                                    <option value="PATIENT">Patient</option>
                                </Select>
                            </div>
                        </Field>
                    </div>

                    <div className="mt-8 flex">
                        <Button
                            type="submit"
                            className="rounded-md bg-mourning-blue-600 px-3 py-2 text-sm font-semibold text-neutral-50 shadow-sm hover:bg-mourning-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mourning-blue-600 active:bg-mourning-blue-800 disabled:opacity-50">
                            Save
                        </Button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                    <h2 className="text-base font-semibold leading-7 text-neutral-900">Personal Information</h2>
                    <p className="mt-1 text-sm leading-6 text-neutral-700">
                        Change this user&apos;s personal information.
                    </p>
                </div>

                <form id="personal-information" className="md:col-span-2">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                        <Field className="col-span-full">
                            <Label
                                htmlFor="fullName"
                                className="block text-sm font-semibold leading-6 text-neutral-900">
                                Full Name
                            </Label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </Field>

                        <Field className="col-span-full">
                            <Label htmlFor="phone" className="block text-sm font-semibold leading-6 text-neutral-900">
                                Phone
                            </Label>
                            <div className="mt-2">
                                <Input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </Field>

                        <Field className="col-span-full">
                            <Label htmlFor="phone" className="block text-sm font-semibold leading-6 text-neutral-900">
                                Address
                            </Label>
                            <div className="mt-2">
                                <Input
                                    type="text"
                                    id="address"
                                    name="address"
                                    className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </Field>

                        <Field className="col-span-full">
                            <Label
                                htmlFor="birthDate"
                                className="block text-sm font-semibold leading-6 text-neutral-900">
                                Birth Date
                            </Label>
                            <div className="mt-2">
                                <Input
                                    type="date"
                                    id="birthDate"
                                    name="birthDate"
                                    className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </Field>
                    </div>

                    <div className="mt-8 flex">
                        <Button
                            type="submit"
                            className="rounded-md bg-mourning-blue-600 px-3 py-2 text-sm font-semibold text-neutral-50 shadow-sm hover:bg-mourning-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mourning-blue-600 active:bg-mourning-blue-800 disabled:opacity-50">
                            Save
                        </Button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                    <h2 className="text-base font-semibold leading-7 text-neutral-900">Doctor Related Information</h2>
                    <p className="mt-1 text-sm leading-6 text-neutral-700">
                        Change this user&apos;s doctor related information.
                    </p>
                </div>

                <form id="doctor-information" className="md:col-span-2">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                        <Field className="col-span-full" disabled={user.accountType !== "DOCTOR"}>
                            <Label
                                htmlFor="fullName"
                                className="block text-sm font-semibold leading-6 text-neutral-900 data-[disabled]:opacity-50">
                                Registration Number
                            </Label>
                            <div className="mt-2">
                                <Input
                                    type="text"
                                    id="registrationNumber"
                                    name="registrationNumber"
                                    className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 data-[disabled]:opacity-50 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </Field>

                        <Field className="col-span-full" disabled={user.accountType !== "DOCTOR"}>
                            <Label
                                htmlFor="registrationOrigin"
                                className="block text-sm font-semibold leading-6 text-neutral-900 data-[disabled]:opacity-50">
                                Registration Origin
                            </Label>
                            <div className="mt-2">
                                <Input
                                    type="text"
                                    id="registrationOrigin"
                                    name="registrationOrigin"
                                    className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 data-[disabled]:opacity-50 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </Field>

                        <Field className="col-span-full" disabled={user.accountType !== "DOCTOR"}>
                            <Label
                                htmlFor="specialization"
                                className="block text-sm font-semibold leading-6 text-neutral-900 data-[disabled]:opacity-50">
                                Specialization
                            </Label>
                            <div className="mt-2">
                                <Input
                                    type="text"
                                    id="specialization"
                                    name="specialization"
                                    className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 data-[disabled]:opacity-50 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </Field>
                    </div>

                    <div className="mt-8 flex">
                        <Button
                            type="submit"
                            disabled={user.accountType !== "DOCTOR"}
                            className="rounded-md bg-mourning-blue-600 px-3 py-2 text-sm font-semibold text-neutral-50 shadow-sm hover:bg-mourning-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mourning-blue-600 active:bg-mourning-blue-800 disabled:opacity-50">
                            Save
                        </Button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                    <h2 className="font-heading text-base font-semibold leading-7 text-neutral-900">Delete account</h2>
                    <p className="mt-1 font-body text-sm leading-6 text-neutral-700">
                        Are you sure you want to delete this account? All of the user&apos;s data will be permanently
                        removed. This action cannot be undone.
                    </p>
                </div>

                <form id="delete-account" className="flex items-start md:col-span-2">
                    <Button
                        type="submit"
                        className="rounded-md bg-red-600 px-3 py-2 font-heading text-sm font-semibold text-neutral-50 shadow-sm hover:bg-red-700 active:bg-red-800">
                        Yes, delete this account
                    </Button>
                </form>
            </div>
        </div>
    )
}
