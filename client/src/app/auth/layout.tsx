import Image from "next/image"
import { type ReactNode } from "react"
import authImage from "../../../public/images/auth-image.jpg"

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <div className="container flex h-screen flex-1">
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                {children}
            </div>
            <div className="relative hidden w-0 flex-1 lg:block">
                <Image
                    src={authImage}
                    alt="Entrance of a medical clinic. Photo by: Erik Mclean on Unsplash"
                    className="absolute inset-0 h-full w-full object-cover"
                    priority
                />
            </div>
        </div>
    )
}
