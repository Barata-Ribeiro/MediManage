import { ValidationError } from "@/interfaces/actions"

interface ValidationErrorProps {
    errors: ValidationError[]
}

export default function InputValidationError({ errors }: ValidationErrorProps) {
    return (
        <ul>
            {errors.map((err, index) => (
                <li key={index} className="text-red-600">
                    {err.message}
                </li>
            ))}
        </ul>
    )
}
