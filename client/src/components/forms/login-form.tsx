"use client"

import postAuthLogin from "@/actions/auth/post-auth-login"
import { useForm } from "@/hooks/use-form"
import Link from "next/link"
import RequisitionError from "@/components/helpers/requisition-error"
import InputValidationError from "@/components/helpers/input-validation-error"

export default function LoginForm() {
    const { isPending, formState, formAction, onSubmit } = useForm(postAuthLogin, {
        ok: false,
        error: null,
        response: null,
    })

    return (
        <form action={formAction} onSubmit={onSubmit} className="space-y-6">
            <div>
                <label htmlFor="emailOrUsername" className="block text-sm font-medium leading-6 text-neutral-900">
                    Email or Username
                </label>
                <div className="mt-2">
                    <input
                        type="text"
                        id="emailOrUsername"
                        name="emailOrUsername"
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        placeholder="Email or Username"
                        required
                    />
                </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-neutral-900">
                    Password
                </label>
                <div className="mt-2">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Password"
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        required
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="rememberMe"
                        type="checkbox"
                        className="h-4 w-4 rounded border-neutral-500 text-hello-spring-600 focus:ring-mourning-blue-600"
                    />
                    <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-neutral-700">
                        Remember me
                    </label>
                </div>

                <div className="text-sm leading-6">
                    <Link
                        href="/auth/forgot-password"
                        className="font-semibold text-mourning-blue-600 hover:text-mourning-blue-500">
                        Forgot password?
                    </Link>
                </div>
            </div>

            {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}
            {formState.error && !Array.isArray(formState.error) && <RequisitionError error={formState.error} />}

            <div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex w-full justify-center rounded-md bg-mourning-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-mourning-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50">
                    {isPending ? "Processing..." : "Login"}
                </button>
            </div>
        </form>
    )
}
