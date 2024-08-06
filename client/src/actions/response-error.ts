import { ProblemDetails, State, ValidationError } from "@/interfaces/actions"
import { ZodError } from "zod"

export default function ResponseError(error: unknown): State {
    const state: State = {
        ok: false,
        error: null,
        response: null,
    }

    console.error(error)

    if (error instanceof ZodError) {
        const validationErrors: ValidationError[] = error.issues.map(issue => ({
            path: issue.path,
            message: issue.message,
        }))
        return {
            ...state,
            error: validationErrors,
        }
    }

    if ((error as ProblemDetails) && !(error instanceof Error)) {
        return {
            ...state,
            error: { ...(error as ProblemDetails) },
        }
    }

    return {
        ...state,
        error: error instanceof Error ? error.message : String(error),
    }
}
