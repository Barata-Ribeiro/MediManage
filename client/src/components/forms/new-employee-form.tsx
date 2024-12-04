"use client"

import postAuthRegisterEmployee from "@/actions/auth/post-auth-register-employee"
import InputValidationError from "@/components/helpers/input-validation-error"
import RequisitionError from "@/components/helpers/requisition-error"
import SimpleAlert from "@/components/helpers/simple-alert"
import Spinner from "@/components/helpers/spinner"
import NewAccountInfoModal from "@/components/modals/new-account-info-modal"
import { useForm } from "@/hooks/use-form"
import { NewAccountResponse } from "@/interfaces/auth"
import { Button, Description, Field, Fieldset, Input, Label, Legend, Select } from "@headlessui/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function NewEmployeeForm() {
    const [modal, setModal] = useState(false)
    const [isDoctor, setIsDoctor] = useState<boolean>(false)
    const { isPending, formState, formAction, onSubmit } = useForm(postAuthRegisterEmployee, {
        ok: false,
        error: null,
        response: null,
    })

    const { data: context } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (formState.ok) setModal(true)
    }, [formState.ok])

    return (
        <>
            <form action={formAction} onSubmit={onSubmit} className="space-y-6">
                <Field className="border-b border-neutral-300 pb-6">
                    <Label htmlFor="accountType" className="block text-sm font-medium leading-6 text-neutral-900">
                        Employee
                    </Label>
                    <Description className="max-w-lg text-sm text-neutral-700">
                        <strong className="text-red-600">Important!</strong> The type of employee you are registering.
                        This will determine the permissions and access level of the employee.
                    </Description>
                    <Select
                        id="accountType"
                        name="accountType"
                        className="mt-1 block w-max rounded-md border-0 py-1.5 pl-3 pr-10 text-neutral-900 ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        aria-label="Select the employee type"
                        defaultValue=""
                        onChange={e => setIsDoctor(e.target.value === "DOCTOR")}
                        required
                        aria-required>
                        <option value="" className="text-neutral-600" disabled>
                            Select a type
                        </option>
                        <option value="ASSISTANT">Assistant</option>
                        <option value="DOCTOR">Doctor</option>
                        <option value="ADMINISTRATOR">Administrator</option>
                    </Select>
                </Field>

                <Field>
                    <Label htmlFor="fullName" className="block text-sm font-medium leading-6 text-neutral-900">
                        Full Name
                    </Label>
                    <Input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className="mt-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        placeholder="John/Jane Doe"
                        minLength={8}
                        maxLength={100}
                        required
                        aria-required
                    />
                </Field>

                <Field>
                    <Label htmlFor="email" className="block text-sm font-medium leading-6 text-neutral-900">
                        Email
                    </Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        className="mt-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        placeholder="contact@example.com"
                        required
                        aria-required
                    />
                </Field>

                <Field>
                    <Label htmlFor="phone" className="block text-sm font-medium leading-6 text-neutral-900">
                        Phone
                    </Label>
                    <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="mt-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        required
                        aria-required
                    />
                </Field>

                <Field>
                    <Label htmlFor="address" className="block text-sm font-medium leading-6 text-neutral-900">
                        Address
                    </Label>
                    <Input
                        type="text"
                        id="address"
                        name="address"
                        className="mt-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        placeholder="1234 Main St"
                        required
                        aria-required
                    />
                </Field>

                <Field>
                    <Label htmlFor="birthDate" className="block text-sm font-medium leading-6 text-neutral-900">
                        Birth Date
                    </Label>
                    <Input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        className="mt-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        required
                        aria-required
                    />
                </Field>

                <Fieldset
                    className="space-y-3 rounded-md border border-neutral-200 p-2 disabled:opacity-50"
                    disabled={!isDoctor}>
                    <Legend className="text-base/7 font-semibold text-neutral-900">Doctor&apos;s Information</Legend>

                    {isDoctor && (
                        <SimpleAlert>
                            <strong>Important!</strong> The following information is required for doctors only. Please
                            fill in the fields below with the doctor&apos;s information.
                        </SimpleAlert>
                    )}

                    <Field>
                        <Label
                            htmlFor="registrationNumber"
                            className="block text-sm font-medium leading-6 text-neutral-900">
                            Registration Number
                        </Label>
                        <Input
                            type="text"
                            id="registrationNumber"
                            name="registrationNumber"
                            className="mt-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                            required={isDoctor}
                            aria-required={isDoctor}
                        />
                    </Field>
                    <Field>
                        <Label
                            htmlFor="registrationOrigin"
                            className="block text-sm font-medium leading-6 text-neutral-900">
                            Registration Origin
                        </Label>
                        <Input
                            type="text"
                            id="registrationOrigin"
                            name="registrationOrigin"
                            className="mt-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                            required={isDoctor}
                            aria-required={isDoctor}
                        />
                    </Field>
                    <Field>
                        <Label
                            htmlFor="specialization"
                            className="block text-sm font-medium leading-6 text-neutral-900">
                            Specialization
                        </Label>
                        <Input
                            type="text"
                            id="specialization"
                            name="specialization"
                            className="mt-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                            required={isDoctor}
                            aria-required={isDoctor}
                        />
                    </Field>
                </Fieldset>

                {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}
                {formState.error && !Array.isArray(formState.error) && <RequisitionError error={formState.error} />}

                <div className="mt-2 flex items-center gap-x-6 justify-self-end border-t border-neutral-200 pt-6">
                    <Button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-md px-3 py-2 text-sm font-semibold leading-6 text-neutral-900 hover:bg-neutral-200">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending || formState.ok || context?.user?.accountType !== "ADMINISTRATOR"}
                        className="inline-flex items-center rounded-md bg-mourning-blue-600 px-3 py-2 text-sm font-semibold text-neutral-50 shadow-sm hover:bg-mourning-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mourning-blue-600 active:bg-mourning-blue-800 disabled:opacity-50">
                        {isPending ? (
                            <>
                                <Spinner /> Loading...
                            </>
                        ) : (
                            "Register Employee"
                        )}
                    </Button>
                </div>
            </form>

            {formState.ok && (
                <NewAccountInfoModal data={formState.response?.data as NewAccountResponse} showModal={modal} />
            )}
        </>
    )
}
