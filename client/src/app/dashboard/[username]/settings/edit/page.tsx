import EditAccountForm from "@/components/forms/edit-account-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Edit Account",
    description: "Edit your account information. Please, be careful with the information you provide here.",
}

export default function EditAccountPage() {
    return (
        <div className="h-full rounded-md bg-neutral-50 p-4 shadow-derek">
            <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
                <EditAccountForm />
            </div>
        </div>
    )
}
