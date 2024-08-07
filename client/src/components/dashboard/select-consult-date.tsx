"use client"

import { useEffect, useState } from "react"
import { Field, Input, Label } from "@headlessui/react"
import putUpdateConsultation from "@/actions/consultations/put-update-consultation"
import { Consultation } from "@/interfaces/consultations"
import parseDate from "@/utils/parse-date"
import { ProblemDetails } from "@/interfaces/actions"
import SimpleErrorNotification from "@/components/helpers/simple-error-notification"

interface Props {
    id: number
    currentScheduledTo: string
}

export default function SelectConsultDate({ id, currentScheduledTo }: Readonly<Props>) {
    const [scheduledTo, setScheduledTo] = useState(currentScheduledTo)
    const [inputDateTime, setInputDateTime] = useState("")
    const [isFocused, setIsFocused] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<ProblemDetails | string | null>(null)

    async function handleScheduledToUpdate() {
        if (scheduledTo === inputDateTime || !inputDateTime) return
        if (!isFocused) return

        try {
            setIsPending(true)

            const state = await putUpdateConsultation(String(id), null, inputDateTime)

            if (!state.ok) {
                setError(state.error as ProblemDetails | string)
                return
            }

            const consultation = state.response?.data as Consultation

            setScheduledTo(consultation.scheduledTo)
        } catch (error) {
            console.error(error)
        } finally {
            setIsPending(false)
        }
    }

    useEffect(() => {
        setScheduledTo(currentScheduledTo)
    }, [currentScheduledTo])

    return (
        <time dateTime={currentScheduledTo} title={parseDate(currentScheduledTo)}>
            {error && <SimpleErrorNotification error={error} />}
            <Field className="w-max">
                <Label htmlFor="scheduledTo" className="sr-only">
                    Scheduled to
                </Label>
                <Input
                    type="datetime-local"
                    id={`scheduled-to-${id}`}
                    name="scheduledTo"
                    min={new Date().toISOString().slice(0, 16)}
                    value={inputDateTime || currentScheduledTo}
                    onChange={event => setInputDateTime(event.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={async () => {
                        setIsFocused(false)
                        await handleScheduledToUpdate()
                    }}
                    disabled={isPending}
                    className="peer block w-full border-0 bg-transparent py-1.5 text-neutral-700 focus:ring-0 disabled:opacity-50 sm:text-sm sm:leading-6"
                />
            </Field>
        </time>
    )
}
