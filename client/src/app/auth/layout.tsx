import { type ReactNode } from "react"

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <div>
            <div>{children}</div>
        </div>
    )
}
