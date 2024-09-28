import { PiCalendarBlank } from "react-icons/pi"

export default function ConsultationEmptySkeleton() {
    return (
        <div className="relative block w-full select-none rounded-md bg-neutral-200 px-12 py-32 text-center">
            <PiCalendarBlank className="mx-auto h-12 w-12 text-neutral-600" />
            <h3 className="mt-2 font-semibold text-neutral-900">No Recent Consultation</h3>
            <p className="mt-1 text-sm text-neutral-700">
                No consultation to display.
                <br />
                Talk to your assistant if needed.
            </p>
        </div>
    )
}
