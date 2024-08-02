"use client"

import { useForm } from "@/hooks/use-form"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useUser } from "@/context/user-context-provider"
import InputValidationError from "@/components/helpers/input-validation-error"
import RequisitionError from "@/components/helpers/requisition-error"
import putUpdateAccount from "@/actions/users/put-update-account"

export default function EditAccountForm() {
    const router = useRouter()
    const data = useUser()
    const { isPending, formState, formAction, onSubmit } = useForm(putUpdateAccount, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) {
            router.push("")
        }
    }, [formState, router])

    return (
        <form action={formAction} onSubmit={onSubmit}>
            <h2 className="text-base font-semibold leading-7 text-neutral-900">Edit Account</h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600">
                Please, be careful with the information you provide here.
            </p>

            <dl className="mt-6 space-y-6 divide-y divide-neutral-200 border-t border-neutral-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                    <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">
                        <label htmlFor="currentPassword">Current Password</label>
                    </dt>
                    <dd className="mt-1 flex flex-col sm:mt-0 sm:flex-auto">
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            autoComplete="current-password"
                            className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        />
                    </dd>
                </div>
                <div className="pt-6 sm:flex">
                    <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">
                        <label htmlFor="email">Email</label>
                    </dt>
                    <dd className="mt-1 flex flex-col sm:mt-0 sm:flex-auto">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="contact@example.com"
                            autoComplete="email"
                            className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        />
                        <p className="mt-1 text-sm font-bold text-neutral-500">{data.user?.email}</p>
                    </dd>
                </div>
                <div className="pt-6 sm:flex">
                    <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">
                        <label htmlFor="fullName">Full name</label>
                    </dt>
                    <dd className="mt-1 flex flex-col sm:mt-0 sm:flex-auto">
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            autoComplete="given-name"
                            className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        />
                        {data.user?.fullName && (
                            <p className="mt-1 text-sm font-bold text-neutral-500">{data.user?.fullName}</p>
                        )}
                    </dd>
                </div>
                <div className="pt-6 sm:flex">
                    <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">
                        <label htmlFor="phone">Phone</label>
                    </dt>
                    <dd className="mt-1 flex flex-col sm:mt-0 sm:flex-auto">
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            autoComplete="tel"
                            placeholder="123-456-7890"
                            className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        />
                        <p className="mt-1 text-sm font-bold text-neutral-500">{data.user?.phone}</p>
                    </dd>
                </div>
                <div className="pt-6 sm:flex">
                    <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">
                        <label htmlFor="address">Address</label>
                    </dt>
                    <dd className="mt-1 flex flex-col sm:mt-0 sm:flex-auto">
                        <input
                            type="text"
                            id="address"
                            name="address"
                            autoComplete="address-level1"
                            placeholder="1234 Main St"
                            className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        />
                        <p className="mt-1 text-sm font-bold text-neutral-500">{data.user?.address}</p>
                    </dd>
                </div>
                <div className="pt-6 sm:flex">
                    <dt className="font-medium text-neutral-900 sm:w-64 sm:flex-none sm:pr-6">
                        <label htmlFor="birthDate">Birth Date</label>
                    </dt>
                    <dd className="mt-1 flex flex-col sm:mt-0 sm:flex-auto">
                        <input
                            type="date"
                            id="birthDate"
                            name="birthDate"
                            className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                        />
                        <p className="mt-1 text-sm font-bold text-neutral-500">{data.user?.birthDate}</p>
                    </dd>
                </div>
            </dl>

            <div className="mt-6 grid border-t">
                <p className="mb-2 mt-1 text-sm leading-6 text-neutral-600">
                    Information regarding your medical records and other sensitive data can only be updated by your
                    doctor or the clinic&apos;s staff.
                </p>

                {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}
                {formState.error && !Array.isArray(formState.error) && <RequisitionError error={formState.error} />}

                <div className="mt-4 flex items-center justify-end gap-x-6">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-md px-3 py-2 text-sm font-semibold leading-6 text-neutral-900 hover:bg-neutral-200">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-md bg-mourning-blue-600 px-3 py-2 text-sm font-semibold text-neutral-50 shadow-sm hover:bg-mourning-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mourning-blue-600 disabled:opacity-50">
                        {isPending ? "Processing..." : "Save"}
                    </button>
                </div>
            </div>
        </form>
    )
}
