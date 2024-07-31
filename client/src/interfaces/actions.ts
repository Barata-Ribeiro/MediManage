interface ApiResponse {
    status: string
    code: number
    message: string
    data?: unknown
}

interface State {
    ok: boolean
    error: string | null
    response: ApiResponse | null
}

export type { ApiResponse, State }
