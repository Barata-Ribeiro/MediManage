"use client"

import { useForm } from "@/hooks/use-form"
import postNewPrescription from "@/actions/prescriptions/post-new-prescription"
import InputValidationError from "@/components/helpers/input-validation-error"
import RequisitionError from "@/components/helpers/requisition-error"
import { Button, Field, Input, Label } from "@headlessui/react"
import Spinner from "@/components/helpers/spinner"
import { useEffect, useState } from "react"
import Tiptap from "@/components/editor/tiptap"
import { useUser } from "@/context/user-context-provider"
import { useRouter } from "next/navigation"

export default function NewPrescriptionForm({ userId }: Readonly<{ userId: string }>) {
    const [content, setContent] = useState<string>("")
    const data = useUser()
    const router = useRouter()
    const { isPending, formState, formAction, onSubmit } = useForm(postNewPrescription, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) {
            setContent("")
            router.push(`/dashboard/${data.user?.username}/records/prescriptions?user=${userId}`)
        }
    }, [formState, data, router, userId])

    return (
        <form action={formAction} onSubmit={onSubmit} className="grid w-full">
            <Input type="hidden" name="userId" value={userId} />

            <Field className="my-4 w-full">
                <Label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Content
                </Label>
                <Tiptap onUpdate={setContent} />
                <Input type="hidden" name="content" value={content} />
            </Field>

            {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}
            {formState.error && !Array.isArray(formState.error) && <RequisitionError error={formState.error} />}

            <Button
                type="submit"
                disabled={isPending}
                className="mt-4 inline-flex items-center place-self-end rounded-md bg-mourning-blue-600 px-3 py-2 text-sm font-semibold text-neutral-50 shadow-sm hover:bg-mourning-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mourning-blue-600 active:bg-mourning-blue-800 disabled:opacity-50">
                {isPending ? (
                    <>
                        <Spinner /> Loading...
                    </>
                ) : (
                    "Issue"
                )}
            </Button>
        </form>
    )
}
