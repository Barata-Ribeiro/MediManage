import { ZodIssue } from "zod"

type ValidationError = Partial<Pick<ZodIssue, "path" | "message">>

interface ApiResponse {
    status: string
    code: number
    message: string
    data?: unknown
}

interface InvalidParam {
    fieldName: string
    reason: string
}

interface ProblemDetails {
    type: string
    title: string
    status: number
    detail: string
    instance: string
    "invalid-params"?: InvalidParam[]
}

interface State {
    ok: boolean
    error: string | ValidationError[] | ProblemDetails | null
    response: ApiResponse | null
}

export type { ApiResponse, ProblemDetails, State, ValidationError }
