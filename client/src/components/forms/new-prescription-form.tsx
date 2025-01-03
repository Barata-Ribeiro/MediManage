"use client"

import postNewPrescription from "@/actions/prescriptions/post-new-prescription"
import InputValidationError from "@/components/helpers/input-validation-error"
import RequisitionError from "@/components/helpers/requisition-error"
import SimpleAlert from "@/components/helpers/simple-alert"
import Spinner from "@/components/helpers/spinner"
import { useForm } from "@/hooks/use-form"
import { Button, Description, Field, Input, Label, Textarea } from "@headlessui/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function NewPrescriptionForm({ userId }: Readonly<{ userId: string }>) {
    const { data } = useSession()
    const router = useRouter()
    const { isPending, formState, formAction, onSubmit } = useForm(postNewPrescription, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) router.push(`/dashboard/${data?.user?.username}/records/prescriptions?user=${userId}`)
    }, [formState, data, router, userId])

    return (
        <form action={formAction} onSubmit={onSubmit} className="flex w-full flex-col justify-center">
            <Input type="hidden" name="userId" value={userId} />

            <Field className="my-4">
                <Label htmlFor="content" className="mb-1 block text-base font-medium text-neutral-700">
                    Content
                </Label>
                <Description className="mb-1 max-w-2xl">
                    Write the prescription content here. Make sure to include all the necessary information to which the
                    patient&apos;s pharmacist will be able to understand and fulfill the prescription.
                </Description>
                <SimpleAlert>
                    Do not include the patient&apos;s name or any other personal information. Only the prescription
                    content is required here.
                </SimpleAlert>
                <Textarea
                    id="content"
                    name="content"
                    rows={4}
                    className="block w-full rounded-md border-0 py-1.5 font-body text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                    defaultValue={""}
                    placeholder="Write the prescription content here..."
                />
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
