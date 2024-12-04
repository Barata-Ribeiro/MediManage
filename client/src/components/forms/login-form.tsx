"use client"

import postAuthLogin from "@/actions/auth/post-auth-login"
import InputValidationError from "@/components/helpers/input-validation-error"
import RequisitionError from "@/components/helpers/requisition-error"
import Spinner from "@/components/helpers/spinner"
import { useForm } from "@/hooks/use-form"
import { LoginResponse } from "@/interfaces/auth"
import { Button, Field, Input, Label } from "@headlessui/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginForm() {
    const router = useRouter()
    const { isPending, formState, formAction, onSubmit } = useForm(postAuthLogin, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) {
            router.push("/dashboard/" + (formState.response?.data as LoginResponse).user.username)
        }
    }, [formState, router])

    return (
        <form action={formAction} onSubmit={onSubmit} className="space-y-6">
            <Field>
                <Label htmlFor="emailOrUsername" className="block text-sm font-medium leading-6 text-neutral-900">
                    Email or Username
                </Label>
                <div className="mt-2">
                    <Input
                        type="text"
                        id="emailOrUsername"
                        name="emailOrUsername"
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        placeholder="Email or Username"
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
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Password"
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        required
                    />
                </div>
            </Field>

            <Field className="flex items-center justify-between">
                <div className="flex items-center">
                    <Input
                        id="remember-me"
                        name="rememberMe"
                        type="checkbox"
                        className="h-4 w-4 rounded border-neutral-500 text-hello-spring-600 focus:ring-hello-spring-600"
                    />
                    <Label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-neutral-700">
                        Remember me
                    </Label>
                </div>

                <div className="text-sm leading-6">
                    <Link
                        href="/auth/forgot-password"
                        className="font-semibold text-mourning-blue-600 hover:text-mourning-blue-500">
                        Forgot password?
                    </Link>
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
                        "Login"
                    )}
                </Button>
            </div>
        </form>
    )
}
