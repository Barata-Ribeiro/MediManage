"use client"

interface LatestNoticeProps {
    data: object
}

export default function LatestNotice({ data }: Readonly<LatestNoticeProps>) {
    if (Object.keys(data).length === 0) {
        return null
    }

    return <div></div>
}
