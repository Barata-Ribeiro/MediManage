import { Dispatch, MutableRefObject, SetStateAction } from "react"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import { ApiResponse } from "@/interfaces/actions"

interface ServerSentEventFnParams<T> {
    token: string
    url: string
    setHomeInfoData: Dispatch<SetStateAction<T>>
    stopResponseSSE: () => void
    abortControllerRef: MutableRefObject<AbortController>
    setError: Dispatch<SetStateAction<string | null>>
}

export default async function listenToServerSentEvents<T>({
    token,
    url,
    setHomeInfoData,
    stopResponseSSE,
    setError,
    abortControllerRef,
}: ServerSentEventFnParams<T>) {
    await fetchEventSource(url, {
        headers: {
            accept: "text/event-stream",
            "Content-type": "application/json",
            Authorization: "Bearer " + token,
        },
        onopen(res) {
            return new Promise<void>((resolve, reject) => {
                if (res.ok && res.status === 200) {
                    console.log("SSE connection opened.")
                    resolve()
                } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
                    const errorMessage = "SSE connection error: " + res.statusText
                    console.error(errorMessage)
                    setError(errorMessage)
                    reject(new Error(errorMessage))
                }
            })
        },
        onmessage(event) {
            const response = JSON.parse(event.data) as ApiResponse
            if (response.code >= 200 || response.code < 400) setHomeInfoData(response.data as T)
        },
        onclose() {
            console.log("SSE connection closed.")
            stopResponseSSE()
        },
        onerror(err) {
            const errorMessage = "SSE connection error: " + err
            console.error(errorMessage)
            setError(errorMessage)
            throw new Error(errorMessage)
        },
        signal: abortControllerRef.current.signal,
    })
}
