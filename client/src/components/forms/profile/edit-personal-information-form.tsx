"use client"

import { User } from "@/interfaces/users"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context-provider"
import { useForm } from "@/hooks/use-form"
import { useEffect } from "react"
import { Button, Description, Field, Input, Label } from "@headlessui/react"
import InputValidationError from "@/components/helpers/input-validation-error"
import RequisitionError from "@/components/helpers/requisition-error"
import Spinner from "@/components/helpers/spinner"
import parseDate from "@/utils/parse-date"
import putUpdateProfile from "@/actions/users/put-update-profile"

export default function EditPersonalInformationForm({ user }: Readonly<{ user: User }>) {
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
        <form id="personal-information" className="md:col-span-2" action={formAction} onSubmit={onSubmit}>
            <div className="mb-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <Field className="col-span-full">
                    <Label htmlFor="fullName" className="block text-sm font-semibold leading-6 text-neutral-900">
                        Full Name
                    </Label>
                    <Description className="text-sm/6 text-neutral-600">
                        Currently: <span className="font-semibold">{user.fullName ?? "Empty"}</span>
                    </Description>
                    <div className="mt-2">
                        <Input
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
                    <Description className="text-sm/6 text-neutral-600">
                        Currently: <span className="font-semibold">{user.phone ?? "Empty"}</span>
                    </Description>
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
                    <Description className="text-sm/6 text-neutral-600">
                        Currently: <span className="font-semibold">{user.address ?? "Empty"}</span>
                    </Description>
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
                    <Label htmlFor="birthDate" className="block text-sm font-semibold leading-6 text-neutral-900">
                        Birth Date
                    </Label>
                    <Description className="text-sm/6 text-neutral-600">
                        Currently: <span className="font-semibold">{parseDate(user.birthDate) ?? "Empty"}</span>
                    </Description>
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
