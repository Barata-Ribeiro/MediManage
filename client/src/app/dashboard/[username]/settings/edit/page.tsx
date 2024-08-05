import EditAccountForm from "@/components/forms/edit-account-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Edit Account",
    description: "Edit your account information. Please, be careful with the information you provide here.",
}

export default function EditAccountPage() {
    return (
        <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <EditAccountForm />
        </div>
    )
}
