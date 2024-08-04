"use client"

import { User } from "@/interfaces/users"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context-provider"
import { useForm } from "@/hooks/use-form"
import putUpdateProfile from "@/actions/users/put-update-profile"
import { useEffect } from "react"
import { Button, Description, Field, Input, Label } from "@headlessui/react"
import InputValidationError from "@/components/helpers/input-validation-error"
import RequisitionError from "@/components/helpers/requisition-error"
import Spinner from "@/components/helpers/spinner"

export default function EditDoctorInformationForm({ user }: Readonly<{ user: User }>) {
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
        <form id="doctor-information" className="md:col-span-2" action={formAction} onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <Field className="col-span-full" disabled={user.accountType !== "DOCTOR"}>
                    <Label
                        htmlFor="registrationNumber"
                        className="block text-sm font-semibold leading-6 text-neutral-900 data-[disabled]:opacity-50">
                        Registration Number
                    </Label>
                    <Description className="text-sm/6 text-neutral-600">
                        Currently: <span className="font-semibold">{user.registrationNumber ?? "Empty"}</span>
                    </Description>
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
                    <Description className="text-sm/6 text-neutral-600">
                        Currently: <span className="font-semibold">{user.registrationOrigin ?? "Empty"}</span>
                    </Description>
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
                    <Description className="text-sm/6 text-neutral-600">
                        Currently: <span className="font-semibold">{user.specialization ?? "Empty"}</span>
                    </Description>
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

            {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}
            {formState.error && !Array.isArray(formState.error) && <RequisitionError error={formState.error} />}

            <div className="mt-4 flex">
                <Button
                    type="submit"
                    disabled={isPending || user.accountType !== "DOCTOR"}
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
