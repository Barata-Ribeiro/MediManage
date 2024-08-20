"use client"

import NoticeEmptySkeleton from "@/components/dashboard/skeletons/notice-empty-skeleton"

interface LatestNoticeProps {
    data: object
}

export default function LatestNotice({ data }: Readonly<LatestNoticeProps>) {
    if (Object.keys(data).length === 0) return <NoticeEmptySkeleton />

    return <div></div>
}
