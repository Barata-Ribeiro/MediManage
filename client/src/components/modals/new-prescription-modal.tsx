"use client"

import {
    Button,
    Description,
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Field,
    Input,
    Label,
} from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaPrescriptionBottleMedical } from "react-icons/fa6"
import { useUser } from "@/context/user-context-provider"
import { useForm } from "@/hooks/use-form"
import postNewPrescription from "@/actions/prescriptions/post-new-prescription"
import { DialogBody, DialogHeader } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog"
import Tiptap from "@/components/editor/tiptap"
import InputValidationError from "@/components/helpers/input-validation-error"
import RequisitionError from "@/components/helpers/requisition-error"
import Spinner from "@/components/helpers/spinner"

export default function NewPrescriptionModal({ userId }: Readonly<{ userId: string }>) {
    const [content, setContent] = useState<string>("")
    const [open, setOpen] = useState(true)

    const router = useRouter()
    const data = useUser()

    const { isPending, formState, formAction, onSubmit } = useForm(postNewPrescription, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) {
            setOpen(false)
            setContent("")
            router.push(`/dashboard/${data.user?.username}/records/prescriptions?user=${userId}`)
        }
    }, [formState, data, router, userId])

    return (
        <Dialog open={open} onClose={setOpen} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-neutral-800 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <form
                    action={formAction}
                    onSubmit={onSubmit}
                    className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-hello-spring-200 sm:mx-0 sm:h-10 sm:w-10">
                                    <FaPrescriptionBottleMedical
                                        aria-hidden
                                        className="h-6 w-6 text-hello-spring-600"
                                    />
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <DialogHeader>
                                        <DialogTitle
                                            as="h3"
                                            className="text-base font-semibold leading-6 text-neutral-900">
                                            Issue new Prescription
                                        </DialogTitle>
                                        <Description className="mt-2 text-sm text-neutral-600">
                                            Write a new prescription for a patient. Fill in the field below and click
                                            the <strong>issue</strong> button to create a new prescription.
                                            <br />
                                            <br />
                                            {/* */}A PDF copy of the prescription will be generated and be made
                                            available for download.
                                        </Description>
                                    </DialogHeader>
                                    <DialogBody>
                                        <Input type="hidden" name="userId" value={userId} />

                                        <Field className="my-4 w-full">
                                            <Label
                                                htmlFor="content"
                                                className="block text-sm font-medium text-gray-700">
                                                Content
                                            </Label>
                                            <Tiptap onUpdate={setContent} />
                                            <Input type="hidden" name="content" value={content} />
                                        </Field>

                                        {formState.error && Array.isArray(formState.error) && (
                                            <InputValidationError errors={formState.error} />
                                        )}
                                        {formState.error && !Array.isArray(formState.error) && (
                                            <RequisitionError error={formState.error} />
                                        )}
                                    </DialogBody>
                                </div>
                            </div>
                        </div>
                        <div className="bg-neutral-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="inline-flex w-full justify-center rounded-md bg-mourning-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-mourning-blue-700 active:bg-mourning-blue-800 sm:ml-3 sm:w-auto">
                                {isPending ? (
                                    <>
                                        <Spinner /> Loading...
                                    </>
                                ) : (
                                    "Issue"
                                )}
                            </Button>
                            <Button
                                type="button"
                                data-autofocus={true}
                                onClick={() => {
                                    setOpen(false)
                                    router.back()
                                }}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-neutral-50 px-3 py-2 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-100 active:bg-neutral-200 sm:mt-0 sm:w-auto">
                                Cancel
                            </Button>
                        </div>
                    </DialogPanel>
                </form>
            </div>
        </Dialog>
    )
}
