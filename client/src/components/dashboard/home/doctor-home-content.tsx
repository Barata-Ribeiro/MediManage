"use client"

import ConsultationsStats from "@/components/dashboard/home/consultations-stats"
import { DoctorInfo } from "@/interfaces/home"
import DividerWithContent from "@/components/helpers/divider-with-content"
import { FaCircleInfo, FaUserClock } from "react-icons/fa6"
import LatestNotice from "@/components/dashboard/home/latest-notice"
import NextConsultation from "@/components/dashboard/home/next-consultation"
import { useCallback, useEffect, useRef, useState } from "react"
import { BACKEND_URL } from "@/utils/api-urls"
import { EventStreamContentType, fetchEventSource } from "@microsoft/fetch-event-source"
import { useCookies } from "@/context/cookie-context-provider"
import { ApiResponse } from "@/interfaces/actions"
import { Consultation } from "@/interfaces/consultations"

export default function DoctorHomeContent({ homeInfo }: Readonly<{ homeInfo: DoctorInfo }>) {
    const [homeInfoData, setHomeInfoData] = useState<DoctorInfo>(homeInfo)
    const abortControllerRef = useRef(new AbortController())
    const URL = BACKEND_URL + "/api/v1/home/stream/doctor-info"
    const { cookie } = useCookies()

    const listenToSseUpdates = useCallback(
        async (token: string) => {
            if (abortControllerRef.current.signal.aborted) abortControllerRef.current = new AbortController()

            await fetchEventSource(URL, {
                headers: {
                    Authorization: "Bearer " + token,
                },
                async onopen(res) {
                    if (res.ok && res.headers.get("content-type") === EventStreamContentType) {
                        console.log("SSE connection established.")
                    } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
                        console.error("SSE connection failed. Status code: " + res.status)
                        console.error(await res.text())
                    } else console.error("SSE connection failed. Status code: " + res.status)
                },
                onmessage(event) {
                    if (abortControllerRef.current.signal.aborted) console.log("SSE connection was aborted.")
                    const response = JSON.parse(event.data) as ApiResponse

                    if (response.status === "success") setHomeInfoData(response.data as DoctorInfo)
                    else console.error("SSE response error: ", response)
                },
                onerror(err) {
                    console.error("SSE connection error: ", err)
                },
                signal: abortControllerRef.current.signal,
            })
        },
        [URL],
    )

    useEffect(() => {
        if (cookie) {
            if (
                !homeInfoData.nextConsultation ||
                (homeInfoData.nextConsultation as Consultation).status === "SCHEDULED"
            ) {
                listenToSseUpdates(cookie).catch(console.error)
            }
        }

        return () => {
            if (abortControllerRef.current) abortControllerRef.current.abort()
        }
    }, [cookie, homeInfoData.nextConsultation, listenToSseUpdates])

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
