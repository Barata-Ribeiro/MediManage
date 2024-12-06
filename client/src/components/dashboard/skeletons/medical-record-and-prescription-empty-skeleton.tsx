import { BsFileEarmarkMedical } from "react-icons/bs"

export default function MedicalRecordAndPrescriptionEmptySkeleton() {
    return (
        <div className="relative block w-full select-none rounded-md bg-neutral-200 px-12 py-32 text-center">
            <BsFileEarmarkMedical className="mx-auto h-12 w-12 text-neutral-600" />
            <h3 className="mt-2 font-semibold text-neutral-900">No medical records or Prescriptions</h3>
            <p className="mt-1 text-sm text-neutral-700">
                Your medical records and prescriptions will be available here.
                <br />
                Please, contact your doctor or clinic staff for more information.
            </p>
        </div>
    )
}
