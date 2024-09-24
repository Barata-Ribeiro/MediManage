import NewEmployeeForm from "@/components/forms/new-employee-form"
import { Metadata } from "next"

interface RegisterEmployeePageProps {
    params: { username: string }
}

export const metadata: Metadata = {
    title: "Register Employee",
    description: "Register a new employee in the company's system.",
}

export default function RegisterEmployeePage({ params }: RegisterEmployeePageProps) {
    return (
        <section
            id="register-new-employee-section"
            aria-labelledby="register-new-employee-section-title"
            className="px-4 sm:px-6 lg:px-8">
            <div>
                <h1
                    id="new-prescription-section-title"
                    className="w-max text-base font-bold leading-6 text-neutral-900">
                    Register a new employee
                </h1>
                <p className="mt-2 max-w-xl text-sm text-neutral-700">
                    Register a new employee in the company&apos;s system. Fill in the fields below and click the{" "}
                    <strong>register</strong> button to add a new employee to the system. The login credentials will be
                    generated automatically and sent to the employee.
                </p>
            </div>

            <NewEmployeeForm />
        </section>
    )
}
