import { ZodIssue } from "zod"

type ValidationError = Partial<Pick<ZodIssue, "path" | "message">>

interface ApiResponse {
    status: string
    code: number
    message: string
    data?: unknown
}

interface State {
    ok: boolean
    error: string | ValidationError[] | null
    response: ApiResponse | null
}

export type { ApiResponse, State, ValidationError }
