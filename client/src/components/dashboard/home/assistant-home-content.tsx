"use client"

import ConsultationsStats from "@/components/dashboard/home/consultations-stats"
import DividerWithContent from "@/components/helpers/divider-with-content"
import { FaCircleInfo, FaUserClock } from "react-icons/fa6"
import LatestNotice from "@/components/dashboard/home/latest-notice"
import { AssistantInfo } from "@/interfaces/home"
import TodayConsultationsStats from "@/components/dashboard/home/today-consultations-stats"
import TodayConsultationsList from "@/components/dashboard/home/today-consultations-list"
import { useCallback, useEffect, useRef, useState } from "react"
import { BACKEND_URL } from "@/utils/api-urls"
import { useCookies } from "@/context/cookie-context-provider"
import listenToServerSentEvents from "@/utils/listen-to-server-sent-events"
import { Consultation } from "@/interfaces/consultations"
import SimpleErrorNotification from "@/components/helpers/simple-error-notification"

export default function AssistantHomeContent({ homeInfo }: Readonly<{ homeInfo: AssistantInfo }>) {
    const [homeInfoData, setHomeInfoData] = useState<AssistantInfo>(homeInfo)
    const [error, setError] = useState<string | null>(null)
    const abortControllerRef = useRef<AbortController>(new AbortController())
    const URL = BACKEND_URL + "/api/v1/home/stream/assistant-info"
    const { cookie } = useCookies()

    const stopResponseSSE = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = new AbortController()
        }
    }, [])

    const sseCallback = useCallback(
        async (token: string) => {
            await listenToServerSentEvents<AssistantInfo>({
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
        const isTodayConsultations = (homeInfoData.consultationsForToday as Consultation[]).length > 0

        if (isCookie && isTodayConsultations)
            sseCallback(cookie)
                .then(r => r)
                .catch(e => setError(e.message))

        return () => stopResponseSSE()
    }, [cookie, homeInfoData, sseCallback, stopResponseSSE])

    return (
        <>
            <TodayConsultationsStats
                data={homeInfo.totalConsultationsForToday}
                totalData={homeInfo.consultationsByStatus}
            />
            <TodayConsultationsList data={homeInfo.consultationsForToday} />
            <DividerWithContent>
                <span className="bg-neutral-50 px-2 text-neutral-600">
                    <FaCircleInfo aria-hidden className="h-5 w-5 text-neutral-600" />
                </span>
            </DividerWithContent>
            <LatestNotice data={homeInfo.latestNotice} />
            <DividerWithContent>
                <span className="bg-neutral-50 px-2 text-neutral-600">
                    <FaUserClock aria-hidden className="h-5 w-5 text-neutral-600" />
                </span>
            </DividerWithContent>
            <ConsultationsStats data={homeInfo.consultationsByStatus} />

            {error && <SimpleErrorNotification error={error} />}
        </>
    )
}
