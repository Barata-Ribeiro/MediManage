import { notFound } from "next/navigation"
import getPublicNoticeById from "@/actions/notices/get-public-notice-by-id"
import StateError from "@/components/helpers/state-error"
import { ProblemDetails } from "@/interfaces/actions"
import { Notice } from "@/interfaces/notices"

interface NoticePageProps {
    params: { username: string; noticeId: string }
}

export default async function NoticePage({ params }: NoticePageProps) {
    if (!params.username || !params.noticeId) return notFound()

    const state = await getPublicNoticeById({ id: params.noticeId })
    if (!state.ok) {
        return <StateError error={state.error as ProblemDetails} />
    }

    const notice = state.response?.data as Notice

    return <section id="view-notice-section" className="space-y-4 divide-y divide-neutral-200"></section>
}
