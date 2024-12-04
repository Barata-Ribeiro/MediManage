"use client"

import postNewNotice from "@/actions/notices/post-new-notice"
import InputValidationError from "@/components/helpers/input-validation-error"
import RequisitionError from "@/components/helpers/requisition-error"
import Spinner from "@/components/helpers/spinner"
import { useForm } from "@/hooks/use-form"
import { Notice } from "@/interfaces/notices"
import { Button, Field, Input, Label, Select, Textarea } from "@headlessui/react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function NewNoticeForm() {
    const [inputMediaUrl, setInputMediaUrl] = useState<string | null>(null)
    const { data } = useSession()
    const router = useRouter()
    const { isPending, formState, formAction, onSubmit } = useForm(postNewNotice, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) {
            router.push(`/dashboard/${data?.user?.username}/notices/${(formState.response?.data as Notice).id}`)
        }
    }, [formState, data, router])

    return (
        <form action={formAction} onSubmit={onSubmit} className="space-y-6">
            <Field>
                <Label htmlFor="title" className="block text-sm font-medium leading-6 text-neutral-900">
                    Title
                </Label>
                <Input
                    type="text"
                    id="title"
                    name="title"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                    required
                    aria-required
                />
            </Field>
            <Field>
                <Label htmlFor="description" className="block text-sm font-medium leading-6 text-neutral-900">
                    Description
                </Label>
                <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 font-body text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                    defaultValue={""}
                    placeholder="Write the notice content here..."
                    required
                    aria-required
                />
            </Field>
            <Field>
                <Label htmlFor="mediaUrl" className="block text-sm font-medium leading-6 text-neutral-900">
                    Media
                </Label>
                <Input
                    type="url"
                    id="mediaUrl"
                    name="mediaUrl"
                    onChange={e => setInputMediaUrl(e.target.value)}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                    placeholder="https://example.com/image.jpg"
                />
            </Field>
            {inputMediaUrl && (
                <figure className="mx-auto max-w-2xl">
                    <Image
                        alt="Preview Image"
                        title="Preview Image"
                        src={inputMediaUrl}
                        style={{ width: "100%", height: "auto" }}
                        className="rounded-md italic"
                        width={0}
                        height={0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <figcaption className="mx-auto mt-1 max-w-lg text-center text-sm text-neutral-600">
                        This is a preview of the image you provided. It does not represent the final look of the notice,
                        or its quality.
                    </figcaption>
                </figure>
            )}
            <Field>
                <Label htmlFor="type" className="block text-sm font-medium leading-6 text-neutral-900">
                    Type
                </Label>
                <Select
                    id="type"
                    name="type"
                    defaultValue=""
                    className="mt-2 block w-max rounded-md border-0 py-1.5 pl-3 pr-10 text-neutral-900 ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                    aria-label="Notice Type">
                    <option value="" className="text-neutral-600" disabled>
                        Select a type
                    </option>
                    <option value="ANNOUNCEMENT">Announcement</option>
                    <option value="WARNING">Warning</option>
                    <option value="ALERT">Alert</option>
                    <option value="INFOS">Infos</option>
                </Select>
            </Field>
            <Field>
                <Label htmlFor="status" className="block text-sm font-medium leading-6 text-neutral-900">
                    Initial Status
                </Label>
                <Select
                    id="status"
                    name="status"
                    className="mt-2 block w-max rounded-md border-0 py-1.5 pl-3 pr-10 text-neutral-900 ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                    aria-label="Initial Status">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                </Select>
            </Field>

            {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}
            {formState.error && !Array.isArray(formState.error) && <RequisitionError error={formState.error} />}

            <div className="mt-2 flex items-center gap-x-6 border-t border-neutral-200 pt-6">
                <Button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-md px-3 py-2 text-sm font-semibold leading-6 text-neutral-900 hover:bg-neutral-200">
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isPending || formState.ok}
                    className="inline-flex items-center rounded-md bg-mourning-blue-600 px-3 py-2 text-sm font-semibold text-neutral-50 shadow-sm hover:bg-mourning-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mourning-blue-600 active:bg-mourning-blue-800 disabled:opacity-50">
                    {isPending ? (
                        <>
                            <Spinner /> Loading...
                        </>
                    ) : (
                        "Create"
                    )}
                </Button>
            </div>
        </form>
    )
}
