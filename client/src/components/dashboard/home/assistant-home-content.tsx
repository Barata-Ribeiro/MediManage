"use client"

import ConsultationsStats from "@/components/dashboard/home/consultations-stats"
import LatestNotice from "@/components/dashboard/home/latest-notice"
import TodayConsultationsList from "@/components/dashboard/home/today-consultations-list"
import TodayConsultationsStats from "@/components/dashboard/home/today-consultations-stats"
import DividerWithContent from "@/components/helpers/divider-with-content"
import SimpleErrorNotification from "@/components/helpers/simple-error-notification"
import { Consultation } from "@/interfaces/consultations"
import { AssistantInfo } from "@/interfaces/home"
import { BACKEND_URL } from "@/utils/api-urls"
import listenToServerSentEvents from "@/utils/listen-to-server-sent-events"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { FaCircleInfo, FaUserClock } from "react-icons/fa6"

export default function AssistantHomeContent({ homeInfo }: Readonly<{ homeInfo: AssistantInfo }>) {
    const [homeInfoData, setHomeInfoData] = useState<AssistantInfo>(homeInfo)
    const [error, setError] = useState<string | null>(null)
    const abortControllerRef = useRef<AbortController>(new AbortController())
    const URL = BACKEND_URL + "/api/v1/home/stream/assistant-info"
    const { data } = useSession()

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
        const isTodayConsultations = (homeInfoData.consultationsForToday as Consultation[]).length > 0

        if (data && !data.error && isTodayConsultations) sseCallback(data.accessToken).catch(e => setError(e.message))

        return () => stopResponseSSE()
    }, [data, homeInfoData, sseCallback, stopResponseSSE])

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
