import { ReactNode } from "react"

export default function MediManageLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <header>HEADER TEST</header>
            <main>{children}</main>
            <footer>FOOTER TEST</footer>
        </>
    )
}
