"use client"

import postAuthLogin from "@/actions/auth/post-auth-login"
import { useForm } from "@/hooks/use-form"
import InputValidationError from "@/components/helpers/input-validation-error"

export default function LoginForm() {
    const { isPending, formState, formAction, onSubmit } = useForm(postAuthLogin, {
        ok: false,
        error: null,
        response: null,
    })

    return (
        <form action={formAction} onSubmit={onSubmit}>
            <input type="text" name="emailOrUsername" placeholder="Username/Email" />
            <input type="password" name="password" placeholder="Password" />
            <input type="checkbox" name="rememberMe" />
            {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}
            {formState.error && !Array.isArray(formState.error) && <p>{formState.error.toString()}</p>}
            <button type="submit" disabled={isPending} className="block text-red-600">
                {isPending ? "Processing..." : "Login"}
            </button>
        </form>
    )
}
