"use client"

import ConsultationsStats from "@/components/dashboard/home/consultations-stats"
import { DoctorInfo } from "@/interfaces/home"
import DividerWithContent from "@/components/helpers/divider-with-content"
import { FaCircleInfo, FaUserClock } from "react-icons/fa6"
import LatestNotice from "@/components/dashboard/home/latest-notice"
import NextConsultation from "@/components/dashboard/home/next-consultation"
import { useCallback, useEffect, useRef, useState } from "react"
import { BACKEND_URL } from "@/utils/api-urls"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import { useCookies } from "@/context/cookie-context-provider"
import { ApiResponse } from "@/interfaces/actions"
import { Consultation } from "@/interfaces/consultations"

export default function DoctorHomeContent({ homeInfo }: Readonly<{ homeInfo: DoctorInfo }>) {
    const [homeInfoData, setHomeInfoData] = useState<DoctorInfo>(homeInfo)
    const abortControllerRef = useRef<AbortController>(new AbortController())
    const URL = BACKEND_URL + "/api/v1/home/stream/doctor-info"
    const { cookie } = useCookies()

    const stopResponseSSE = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = new AbortController()
        }
    }, [])

    const listenToSseUpdates = useCallback(
        async (token: string) => {
            await fetchEventSource(URL, {
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
                            console.error("SSE connection error: ", res)
                            reject(new Error("SSE connection error: " + res))
                        }
                    })
                },
                onmessage(event) {
                    const response = JSON.parse(event.data) as ApiResponse
                    console.log("DATA: ", response)
                    if (response.code === 200) setHomeInfoData(response.data as DoctorInfo)
                },
                onclose() {
                    console.log("SSE connection closed.")
                    stopResponseSSE()
                },
                onerror(err) {
                    console.error("SSE connection error: ", err)
                    throw new Error("SSE connection error: " + err)
                },
                signal: abortControllerRef.current.signal,
            })
        },
        [URL, stopResponseSSE],
    )

    useEffect(() => {
        const isCookie = cookie && cookie !== "null" && cookie !== "undefined"
        const isNextConsultationValid =
            (homeInfoData.nextConsultation as Consultation).scheduledTo > new Date().toISOString()

        if (isCookie && isNextConsultationValid)
            listenToSseUpdates(cookie)
                .then(r => r)
                .catch(e => console.error(e))

        return () => stopResponseSSE()
    }, [cookie, homeInfoData, listenToSseUpdates, stopResponseSSE])

    return (
        <>
            <ConsultationsStats data={homeInfoData.consultationsByStatus} />
            <DividerWithContent>
                <span className="bg-neutral-50 px-2 text-neutral-600">
                    <FaCircleInfo aria-hidden className="h-5 w-5 text-neutral-600" />
                </span>
            </DividerWithContent>
            <LatestNotice data={homeInfoData.latestNotice} />
            <DividerWithContent>
                <span className="bg-neutral-50 px-2 text-neutral-600">
                    <FaUserClock aria-hidden className="h-5 w-5 text-neutral-600" />
                </span>
            </DividerWithContent>
            <NextConsultation data={homeInfoData.nextConsultation} />
        </>
    )
}
