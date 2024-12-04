"use client"

import postScheduleNewConsultation from "@/actions/consultations/post-schedule-new-consultation"
import UserCombobox from "@/components/dashboard/filters/user-combobox"
import InputValidationError from "@/components/helpers/input-validation-error"
import RequisitionError from "@/components/helpers/requisition-error"
import SimpleAlert from "@/components/helpers/simple-alert"
import Spinner from "@/components/helpers/spinner"
import { useUser } from "@/context/user-context-provider"
import { useForm } from "@/hooks/use-form"
import { Consultation } from "@/interfaces/consultations"
import parseDate from "@/utils/parse-date"
import { Button, Field, Input, Label } from "@headlessui/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function NewConsultForm() {
    const [newConsultation, setNewConsultation] = useState<Consultation | null>(null)
    const { isPending, formState, formAction, onSubmit } = useForm(postScheduleNewConsultation, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) {
            const consultation = formState.response?.data as Consultation
            setNewConsultation(consultation)
        }
    }, [formState])

    const router = useRouter()
    const context = useUser()
    if (!context) return null

    const formattedDate = new Date().toISOString().slice(0, 16)

    return (
        <div className="my-8 grid grid-cols-1 items-center justify-between gap-6 lg:grid-cols-2">
            <form action={formAction} onSubmit={onSubmit} className="grid w-auto gap-2">
                <div className="flex flex-wrap gap-2">
                    <Field>
                        <UserCombobox type={"PATIENT"} />
                    </Field>

                    <Field>
                        <UserCombobox type={"DOCTOR"} />
                    </Field>
                </div>

                <Field className="w-max">
                    <Label htmlFor="scheduledTo" className="block text-sm font-medium text-neutral-900">
                        Scheduled To
                    </Label>
                    <div className="mt-2">
                        <Input
                            type="datetime-local"
                            id="scheduledTo"
                            name="scheduledTo"
                            min={formattedDate}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            required
                            aria-required
                        />
                    </div>
                </Field>

                {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}
                {formState.error && !Array.isArray(formState.error) && <RequisitionError error={formState.error} />}

                {context.user?.accountType !== "ASSISTANT" && newConsultation === null && (
                    <SimpleAlert>
                        Only an <strong>assistant</strong> can schedule a consultation.
                    </SimpleAlert>
                )}

                <div className="mt-2 flex items-center gap-x-6">
                    <Button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-md px-3 py-2 text-sm font-semibold leading-6 text-neutral-900 hover:bg-neutral-200">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={
                            isPending ||
                            (formState.ok && newConsultation !== null) ||
                            context.user?.accountType !== "ASSISTANT"
                        }
                        className="inline-flex items-center rounded-md bg-mourning-blue-600 px-3 py-2 text-sm font-semibold text-neutral-50 shadow-sm hover:bg-mourning-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mourning-blue-600 active:bg-mourning-blue-800 disabled:opacity-50">
                        {isPending ? (
                            <>
                                <Spinner /> Loading...
                            </>
                        ) : (
                            "Schedule"
                        )}
                    </Button>
                </div>
            </form>

            {newConsultation && (
                <div className="grid gap-2 rounded-lg border-2 border-dashed border-green-300 bg-green-50 p-12 text-center">
                    <h2 className="text-lg font-semibold capitalize text-neutral-900">
                        Consultation {newConsultation.status.toLowerCase()}
                    </h2>
                    <p className="mb-8 text-sm text-neutral-700">
                        Consultation has been successfully scheduled. Here are the details:
                    </p>
                    <p className="text-sm text-neutral-900">
                        <span className="font-semibold">Patient:</span> {newConsultation.patient.fullName}
                    </p>
                    <p className="text-sm text-neutral-900">
                        <span className="font-semibold">Doctor:</span> {newConsultation.doctor.fullName}
                    </p>
                    <p className="text-sm text-neutral-900">
                        <span className="font-semibold">Scheduled To:</span> {parseDate(newConsultation.scheduledTo)}
                    </p>

                    <Link
                        href="/"
                        className="mx-auto mt-4 w-max text-sm font-semibold leading-7 hover:text-neutral-800 active:text-neutral-700">
                        <span aria-hidden="true">&larr;</span> Back to home
                    </Link>
                </div>
            )}
        </div>
    )
}
