"use client"

import { User } from "@/interfaces/users"
import { Button, Description, Field, Input, Label, Select } from "@headlessui/react"
import Spinner from "@/components/helpers/spinner"
import { useForm } from "@/hooks/use-form"
import { useRouter } from "next/navigation"
import InputValidationError from "@/components/helpers/input-validation-error"
import RequisitionError from "@/components/helpers/requisition-error"
import { useUser } from "@/context/user-context-provider"
import { useEffect } from "react"
import putUpdateProfile from "@/actions/users/put-update-profile"

export default function EditAccountVitalForm({ user }: Readonly<{ user: User }>) {
    const router = useRouter()
    const data = useUser()
    const { isPending, formState, formAction, onSubmit } = useForm(putUpdateProfile, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) {
            router.push("/dashboard/" + data.user?.username + "/users/profile?id=" + user.id)
        }
    }, [data, formState, router, user])

    return (
        <form id="account-vital" className="md:col-span-2" action={formAction} onSubmit={onSubmit}>
            <Input type="hidden" name="userId" value={user.id} />
            <div className="mb-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <Field className="col-span-full">
                    <Label htmlFor="username" className="block text-sm font-semibold leading-6 text-neutral-900">
                        Username
                    </Label>
                    <Description className="text-sm/6 text-neutral-600">
                        Currently: <span className="font-semibold">{user.username}</span>
                    </Description>
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
                    <Description className="text-sm/6 text-neutral-600">
                        Currently: <span className="font-semibold">{user.email}</span>
                    </Description>
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
                    <Label htmlFor="accountType" className="block text-sm font-semibold leading-6 text-neutral-900">
                        Account Type
                    </Label>
                    <Description className="text-sm/6 text-neutral-600">
                        Currently: <span className="font-semibold capitalize">{user.accountType.toLowerCase()}</span>
                    </Description>
                    <div className="mt-2">
                        <Select
                            name="accountType"
                            aria-label="Account Type"
                            defaultValue=""
                            className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6">
                            <option value="" disabled hidden>
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

            {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}
            {formState.error && !Array.isArray(formState.error) && <RequisitionError error={formState.error} />}

            <div className="mt-4 flex">
                <Button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center rounded-md bg-mourning-blue-600 px-3 py-2 text-sm font-semibold text-neutral-50 shadow-sm hover:bg-mourning-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mourning-blue-600 active:bg-mourning-blue-800 disabled:opacity-50">
                    {isPending ? (
                        <>
                            <Spinner /> Loading...
                        </>
                    ) : (
                        "Save"
                    )}
                </Button>
            </div>
        </form>
    )
}
