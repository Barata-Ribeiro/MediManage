"use client"

import ConsultationsStats from "@/components/dashboard/home/consultations-stats"
import { DoctorInfo } from "@/interfaces/home"
import DividerWithContent from "@/components/helpers/divider-with-content"
import { FaCircleInfo, FaUserClock } from "react-icons/fa6"
import LatestNotice from "@/components/dashboard/home/latest-notice"
import NextConsultation from "@/components/dashboard/home/next-consultation"
import { useCallback, useEffect, useRef, useState } from "react"
import { BACKEND_URL } from "@/utils/api-urls"
import { useCookies } from "@/context/cookie-context-provider"
import { Consultation } from "@/interfaces/consultations"
import listenToServerSentEvents from "@/utils/listen-to-server-sent-events"
import SimpleErrorNotification from "@/components/helpers/simple-error-notification"

export default function DoctorHomeContent({ homeInfo }: Readonly<{ homeInfo: DoctorInfo }>) {
    const [homeInfoData, setHomeInfoData] = useState<DoctorInfo>(homeInfo)
    const [error, setError] = useState<string | null>(null)
    const abortControllerRef = useRef<AbortController>(new AbortController())
    const URL = BACKEND_URL + "/api/v1/home/stream/doctor-info"
    const { cookie } = useCookies()

    const stopResponseSSE = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = new AbortController()
        }
    }, [])

    const sseCallback = useCallback(
        async (token: string) => {
            await listenToServerSentEvents<DoctorInfo>({
                token,
                url: URL,
                setHomeInfoData,
                stopResponseSSE,
                abortControllerRef,
                setError,
            })
        },
        [URL, stopResponseSSE],
    )

    useEffect(() => {
        const isCookie = cookie && cookie !== "null" && cookie !== "undefined"
        const isNextConsultationValid =
            (homeInfoData.nextConsultation as Consultation).scheduledTo > new Date().toISOString()

        if (isCookie && isNextConsultationValid)
            sseCallback(cookie)
                .then(r => r)
                .catch(e => setError(e.message))

        return () => stopResponseSSE()
    }, [cookie, homeInfoData, sseCallback, stopResponseSSE])

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

            {error && <SimpleErrorNotification error={error} />}
        </>
    )
}
