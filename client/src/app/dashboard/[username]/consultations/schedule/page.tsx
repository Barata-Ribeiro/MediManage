import { Metadata } from "next"
import NewConsultForm from "@/components/forms/new-consult-form"

export const metadata: Metadata = {
    title: "New Consultation",
    description: "Schedule a new consultation between a patient and a doctor.",
}

export default function NewConsultationPage() {
    return (
        <div className="h-[30rem]">
            <div>
                <h1 className="w-max text-base font-bold leading-6 text-neutral-900">Schedule a new consultation</h1>
                <p className="mt-2 max-w-xl text-sm text-neutral-700">
                    Schedule a new consultation between a patient and a doctor. Fill in the form below with the
                    necessary information.
                </p>
            </div>

            <NewConsultForm />
        </div>
    )
}
