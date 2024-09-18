import { notFound } from "next/navigation"
import getNotificationById from "@/actions/notifications/get-notification-by-id"
import { Notification } from "@/interfaces/notifications"
import parseDate from "@/utils/parse-date"
import notifImage from "../../../../../../public/images/notif-image.jpg"
import Image from "next/image"

interface ViewNotifPageProps {
    params: { id: string }
    searchParams?: { [key: string]: string | string[] | undefined }
}

export function generateMetadata({ params }: ViewNotifPageProps) {
    return {
        title: "Notification " + params.id,
        description: "You are viewing a notification with ID " + params.id,
    }
}

export default async function ViewNotifPage({ params, searchParams }: Readonly<ViewNotifPageProps>) {
    if (!params.id) return notFound()
    if (!searchParams) return notFound()

    const notifState = await getNotificationById({
        userId: searchParams.user as string,
        notifId: +params.id,
    })

    if (!notifState.ok) return notFound()

    const notification = notifState.response?.data as Notification

    return (
        <section
            id={"notification-" + params.id + "-section"}
            aria-labelledby={"notification-" + params.id + "-section-title"}
            className="px-4 sm:px-6 lg:px-8">
            <div className="w-max flex-auto">
                <h1
                    id={"notification-" + params.id + "-section-title"}
                    className="w-max text-base font-bold leading-6 text-neutral-900">
                    Notification {params.id}
                </h1>
                <p className="mt-2 max-w-xl text-sm text-neutral-700">
                    Read the details of this notification bellow. Click on the button bellow to mark as read/unread.
                </p>
            </div>
            <article
                id={"notification-" + params.id + "-section-content"}
                className="mx-auto mt-6 max-w-2xl align-middle">
                <header className="lg:py flex w-full flex-wrap items-center justify-between border-b border-neutral-200 py-2 sm:py-3">
                    <h2
                        aria-hidden="true"
                        title={process.env.INSTITUTION_NAME ?? "YOUR LOGO!"}
                        className="text-xl font-bold leading-7 text-neutral-900">
                        {process.env.INSTITUTION_NAME ?? "YOUR LOGO!"}
                    </h2>
                    <time dateTime={notification.issuedAt} className="text-sm text-neutral-700">
                        Issued at {parseDate(notification.issuedAt)}
                    </time>
                </header>
                <Image
                    src={notifImage}
                    alt="Lot of envelope paper. Photo by: Joanna Kosinska on Unsplash"
                    className="mt-4 h-56 w-full rounded-md object-cover italic shadow md:h-72"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    placeholder="blur"
                    priority
                />
                <div className="mt-8">
                    <h3 className="text-lg font-bold leading-6 text-mourning-blue-500">Title</h3>
                    <p className="mt-2 text-neutral-900">{notification.title}</p>

                    <h3 className="mt-6 text-lg font-bold leading-6 text-mourning-blue-500">Message</h3>
                    <p className="mt-2 leading-7 text-neutral-900">{notification.message}</p>

                    <div className="flex justify-between">
                        <p className="mt-8 text-neutral-700">
                            Thanks, <br />
                            The {process.env.INSTITUTION_NAME} team
                        </p>

                        {/*IMPLEMENT MARK AS READ/UNREAD BUTTON HERE*/}
                    </div>
                </div>
                <footer className="mt-8">
                    <p className="text-center text-sm text-neutral-700">
                        This notification was sent to you by the {process.env.INSTITUTION_NAME} system, automatically.
                        If you have any questions, please contact the {process.env.INSTITUTION_NAME} team.
                    </p>
                    <p className="mt-3 text-center text-sm text-neutral-500">
                        &copy; {new Date().getFullYear()} {process.env.INSTITUTION_NAME}. All rights reserved.
                    </p>
                </footer>
            </article>
        </section>
    )
}
