import { FaTriangleExclamation } from "react-icons/fa6"

export default function RequisitionError({ error }: Readonly<{ error: string }>) {
    return (
        <div className="rounded-md border border-yellow-500 bg-yellow-50 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <FaTriangleExclamation className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="font-heading text-sm font-medium text-yellow-800">Failed Request</h3>
                    <div className="mt-2 font-body text-sm text-yellow-700">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
