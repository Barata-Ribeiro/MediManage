"use client"

import { useForm } from "@/hooks/use-form"
import postAuthLogin from "@/actions/auth/post-auth-login"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function EditAccountForm() {
    const router = useRouter()
    const { isPending, formState, formAction, onSubmit } = useForm(postAuthLogin, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) {
            router.push("")
        }
    }, [router])

    return (
        <form action={formAction} onSubmit={onSubmit}>
            <h2 className="text-base font-semibold leading-7 text-neutral-900">Edit Account</h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600">
                Please, be careful with the information you provide here.
            </p>

            <dl className="mt-6 space-y-6 divide-y divide-neutral-200 border-t border-neutral-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                    <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">Username</dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="johndoe / janedoe"
                            autoComplete="username"
                            className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        />
                    </dd>
                </div>
                <div className="pt-6 sm:flex">
                    <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">Full name</dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            autoComplete="given-name"
                            className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        />
                    </dd>
                </div>
                <div className="pt-6 sm:flex">
                    <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">Email address</dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="contact@example.com"
                            className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        />
                    </dd>
                </div>
            </dl>

            <div className="mt-6 grid border-t">
                <p className="mt-1 text-sm leading-6 text-neutral-600">
                    Information regarding your medical records and other sensitive data can only be updated by your
                    doctor or the clinic&apos;s staff.
                </p>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-sm font-semibold leading-6 text-gray-900">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        {isPending ? "Processing..." : "Save"}
                    </button>
                </div>
            </div>
        </form>
    )
}
