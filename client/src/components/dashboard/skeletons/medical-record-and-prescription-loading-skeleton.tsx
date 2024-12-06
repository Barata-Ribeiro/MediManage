import { BsFileEarmarkMedical } from "react-icons/bs"

export default function MedicalRecordAndPrescriptionLoadingSkeleton() {
    return (
        <output className="relative block w-full animate-pulse select-none rounded-md bg-neutral-200 px-12 py-32 text-center">
            <BsFileEarmarkMedical className="mx-auto h-12 w-12 text-neutral-600" />
            <h3 className="mt-2 font-semibold text-neutral-900">Loading medical records and prescriptions...</h3>
            <p className="mt-1 text-sm text-neutral-700">Please wait while we fetch your data.</p>
        </output>
    )
}
