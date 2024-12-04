import RegisterForm from "@/components/forms/register-form"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Register",
    description: "Register a new account",
}

export default function RegisterPage() {
    return (
        <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
                <div className="h-10 w-10 rounded-full bg-hello-spring-600 shadow" />
                <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-neutral-900">
                    Register a new account
                </h2>
                <p className="mt-2 text-sm leading-6 text-neutral-700">
                    Already a member{" "}
                    <Link
                        href="/auth/login"
                        className="font-semibold text-mourning-blue-600 hover:text-mourning-blue-500">
                        Login here
                    </Link>
                </p>
            </div>

            <div className="mt-10">
                <RegisterForm />

                <div className="mt-10">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-neutral-300" />
                        </div>
                        <div className="relative flex justify-center text-sm font-medium leading-6">
                            <span className="bg-neutral-200 px-6 text-neutral-900">Important</span>
                        </div>
                    </div>

                    <p className="mt-6 text-center leading-6">
                        If you are an employee, contact your administrator to create an account. If you are a patient,
                        contact the clinic to update certain information.
                    </p>
                </div>
            </div>
        </div>
    )
}
