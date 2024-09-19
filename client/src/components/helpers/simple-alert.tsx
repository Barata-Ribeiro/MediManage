import { type ReactNode } from "react"
import { FaCircleExclamation } from "react-icons/fa6"

interface SimpleAlertProps {
    children: ReactNode
}

export default function SimpleAlert({ children }: SimpleAlertProps) {
    return (
        <div role="alert" className="mb-2 rounded-md bg-blue-50 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <FaCircleExclamation aria-hidden="true" className="h-5 w-5 text-blue-400" />
                </div>
                <p className="ml-3 flex-1 text-sm text-blue-700">{children}</p>
            </div>
        </div>
    )
}
