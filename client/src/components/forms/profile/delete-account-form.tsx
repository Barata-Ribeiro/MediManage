"use client"

import deleteUserProfile from "@/actions/users/delete-user-profile"
import RequisitionError from "@/components/helpers/requisition-error"
import Spinner from "@/components/helpers/spinner"
import { useForm } from "@/hooks/use-form"
import { User } from "@/interfaces/users"
import { Button, Input } from "@headlessui/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DeleteAccountForm({ user }: Readonly<{ user: User }>) {
    const router = useRouter()
    const { data } = useSession()
    const { isPending, formState, formAction, onSubmit } = useForm(deleteUserProfile, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) {
            router.push("/dashboard/" + data?.user?.username + "/users")
        }
    }, [data, formState, router, user])

    return (
        <form
            id="delete-account"
            className="flex flex-col items-start gap-4 md:col-span-2"
            action={formAction}
            onSubmit={onSubmit}>
            <Input type="hidden" name="userId" value={user.id} />

            {formState.error && !Array.isArray(formState.error) && <RequisitionError error={formState.error} />}

            <Button
                type="submit"
                disabled={isPending || user.id === data?.user?.id}
                className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-neutral-50 shadow-sm hover:bg-red-700 active:bg-red-800 disabled:opacity-50">
                {isPending ? (
                    <>
                        <Spinner /> Loading...
                    </>
                ) : (
                    "Yes, delete this account"
                )}
            </Button>
        </form>
    )
}
