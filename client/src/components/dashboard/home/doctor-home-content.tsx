"use client"

import ConsultationsStats from "@/components/dashboard/home/consultations-stats"
import LatestNotice from "@/components/dashboard/home/latest-notice"
import NextConsultation from "@/components/dashboard/home/next-consultation"
import DividerWithContent from "@/components/helpers/divider-with-content"
import SimpleErrorNotification from "@/components/helpers/simple-error-notification"
import { Consultation } from "@/interfaces/consultations"
import { DoctorInfo } from "@/interfaces/home"
import { BACKEND_URL } from "@/utils/api-urls"
import listenToServerSentEvents from "@/utils/listen-to-server-sent-events"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { FaCircleInfo, FaUserClock } from "react-icons/fa6"

export default function DoctorHomeContent({ homeInfo }: Readonly<{ homeInfo: DoctorInfo }>) {
    const [homeInfoData, setHomeInfoData] = useState<DoctorInfo>(homeInfo)
    const [error, setError] = useState<string | null>(null)
    const abortControllerRef = useRef<AbortController>(new AbortController())
    const URL = BACKEND_URL + "/api/v1/home/stream/doctor-info"
    const { data } = useSession()

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
        const isNextConsultationValid =
            (homeInfoData.nextConsultation as Consultation).scheduledTo > new Date().toISOString()

        if (data && !data.error && isNextConsultationValid)
            sseCallback(data.accessToken).catch(e => setError(e.message))

        return () => stopResponseSSE()
    }, [data, homeInfoData, sseCallback, stopResponseSSE])

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
