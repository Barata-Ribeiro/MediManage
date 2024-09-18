"use client"

import { useForm } from "@/hooks/use-form"
import InputValidationError from "@/components/helpers/input-validation-error"
import RequisitionError from "@/components/helpers/requisition-error"
import { Button, Description, Field, Input, Label, Textarea } from "@headlessui/react"
import Spinner from "@/components/helpers/spinner"
import { useEffect } from "react"
import { useUser } from "@/context/user-context-provider"
import { useRouter } from "next/navigation"
import { FaInfoCircle } from "react-icons/fa"
import patchPrescriptionByPatientAndId from "@/actions/prescriptions/patch-prescription-by-patient-and-id"
import { Prescription } from "@/interfaces/prescriptions"

interface EditPrescriptionFormprops {
    id: string
    patientUsername: string
    prevContent: string
}

export default function EditPrescriptionForm({
    id: presId,
    patientUsername,
    prevContent,
}: Readonly<EditPrescriptionFormprops>) {
    const data = useUser()
    const router = useRouter()

    const { isPending, formState, formAction, onSubmit } = useForm(patchPrescriptionByPatientAndId, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) {
            const response = formState.response?.data as Prescription
            router.push(`/dashboard/${data.user?.username}/records/prescriptions/${response.id}/${patientUsername}/pdf`)
        }
    }, [formState, data, router, patientUsername])

    return (
        <form action={formAction} onSubmit={onSubmit} className="flex w-full flex-col justify-center">
            <Input type="hidden" name="presId" value={presId} />
            <Input type="hidden" name="patientUsername" value={patientUsername} />

            <Field className="my-4">
                <Label htmlFor="content" className="mb-1 block font-heading text-base font-medium text-neutral-700">
                    Content
                </Label>
                <Description className="mb-2 flex items-start gap-1 text-sm text-neutral-600">
                    <FaInfoCircle aria-hidden="true" className="h-4 w-4" size={18} /> Write only the content of the
                    prescription. Do not include the patient&apos;s name or any other personal information.
                </Description>
                <Textarea
                    id="content"
                    name="content"
                    rows={8}
                    className="block w-full rounded-md border-0 py-1.5 font-body text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                    defaultValue={prevContent}
                    placeholder="Write the prescription content here..."
                />
            </Field>

            {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}
            {formState.error && !Array.isArray(formState.error) && <RequisitionError error={formState.error} />}

            <div className="mt-4 flex items-center justify-end gap-x-6 place-self-end">
                <Button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-md px-3 py-2 text-sm font-semibold leading-6 text-neutral-900 hover:bg-neutral-200">
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center rounded-md bg-mourning-blue-600 px-3 py-2 text-sm font-semibold leading-6 text-neutral-50 shadow-sm hover:bg-mourning-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mourning-blue-600 active:bg-mourning-blue-800 disabled:opacity-50">
                    {isPending ? (
                        <>
                            <Spinner /> Loading...
                        </>
                    ) : (
                        "Update"
                    )}
                </Button>
            </div>
        </form>
    )
}
