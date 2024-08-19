import { type ReactNode } from "react"

interface DividerWithIconProps {
    children: ReactNode
}

export default function DividerWithContent({ children }: Readonly<DividerWithIconProps>) {
    return (
        <div className="relative">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">{children}</div>
        </div>
    )
}
