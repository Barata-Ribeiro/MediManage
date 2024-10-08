import NewNoticeForm from "@/components/forms/new-notice-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "New Notice",
    description:
        "Create a new notice to be displayed on the home dashboard, or, if available, on the public board for the clinic's website.",
}

export default function NewNotice() {
    return (
        <section id="new-notice-section" aria-labelledby="new-notice-section-title" className="h-full">
            <div className="mb-6">
                <h1 id="new-notice-section-title" className="w-max text-base font-bold leading-6 text-neutral-900">
                    Create a new notice
                </h1>
                <p className="mt-2 max-w-xl text-sm text-neutral-700">
                    Create a new notice to be displayed on the home dashboard, or, if available, on the public board for
                    the clinic&apos;s website. Fill in the form below with the necessary information.
                </p>
            </div>

            <NewNoticeForm />
        </section>
    )
}
