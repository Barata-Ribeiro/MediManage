"use client"

import postAuthRegister from "@/actions/auth/post-auth-register"
import InputValidationError from "@/components/helpers/input-validation-error"
import RequisitionError from "@/components/helpers/requisition-error"
import Spinner from "@/components/helpers/spinner"
import { useForm } from "@/hooks/use-form"
import { Button, Field, Input, Label } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function RegisterForm() {
    const router = useRouter()
    const { isPending, formState, formAction, onSubmit } = useForm(postAuthRegister, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) router.replace("/auth/login")
    }, [formState, router])

    return (
        <form action={formAction} onSubmit={onSubmit} className="space-y-6">
            <Field>
                <Label htmlFor="username" className="block text-sm font-medium leading-6 text-neutral-900">
                    Username
                </Label>
                <div className="mt-2">
                    <Input
                        type="text"
                        id="username"
                        name="username"
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        placeholder="johndoe / janedoe"
                        required
                    />
                </div>
            </Field>

            <Field>
                <Label htmlFor="emailOrUsername" className="block text-sm font-medium leading-6 text-neutral-900">
                    Email
                </Label>
                <div className="mt-2">
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        placeholder="contact@example.com"
                        required
                    />
                </div>
            </Field>

            <Field>
                <Label htmlFor="password" className="block text-sm font-medium leading-6 text-neutral-900">
                    Password
                </Label>
                <div className="mt-2">
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        autoComplete="new-password"
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        required
                    />
                </div>
            </Field>

            <Field>
                <Label htmlFor="password" className="block text-sm font-medium leading-6 text-neutral-900">
                    Confirm Password
                </Label>
                <div className="mt-2">
                    <Input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        required
                    />
                </div>
            </Field>

            {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}
            {formState.error && !Array.isArray(formState.error) && <RequisitionError error={formState.error} />}

            <div>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex w-full items-center justify-center rounded-md bg-mourning-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-mourning-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50">
                    {isPending ? (
                        <>
                            <Spinner /> Loading...
                        </>
                    ) : (
                        "Register"
                    )}
                </Button>
            </div>
        </form>
    )
}
