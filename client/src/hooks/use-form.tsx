import { SyntheticEvent, useTransition } from "react"
import { useFormState } from "react-dom"

export interface UseFormHook<FormState> {
    formState: FormState
    isPending: boolean
    formAction: (payload: FormData) => void
    onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void
}

export function useForm<FormState>(
    action: (formState: Awaited<FormState>, formData: FormData) => Promise<FormState>,
    initialState: Awaited<FormState>,
): UseFormHook<FormState> {
    const [isPending, startTransition] = useTransition()
    const [formState, formAction] = useFormState(action, initialState)

    function onSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        startTransition(async () => {
            await formAction(formData)
        })
    }

    return {
        formState,
        isPending,
        formAction,
        onSubmit,
    }
}
