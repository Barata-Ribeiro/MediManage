import { ValidationError } from "@/interfaces/actions"
import { FaCircleXmark } from "react-icons/fa6"

interface ValidationErrorProps {
    errors: ValidationError[]
}

export default function InputValidationError({ errors }: Readonly<ValidationErrorProps>) {
    const errorCount = errors.length
    const errorText = errorCount > 1 ? "errors" : "error"
    const verb = errorCount > 1 ? "were" : "was"

    return (
        <div className="rounded-md border border-red-500 bg-red-50 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <FaCircleXmark className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="font-heading text-sm font-medium text-red-800">
                        There {verb} {errorCount} {errorText} with your submission
                    </h3>
                    <ul className="list-disc space-y-1 pl-5 font-body">
                        {errors.map((err, index) => (
                            <li key={`${err.path}_${index}`} className="text-red-600">
                                {err.message}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
