import { State } from "@/interfaces/actions"

export default function ResponseError(error: unknown): State {
    const state: State = {
        ok: false,
        error: null,
        response: null,
    }

    console.error(error)

    return {
        ...state,
        error: error instanceof Error ? error.message : String(error),
    }
}
