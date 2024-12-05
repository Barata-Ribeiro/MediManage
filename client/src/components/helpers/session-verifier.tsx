"use client"

import deleteSession from "@/actions/auth/delete-session"

import { Route } from "next"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import { useCallback, useEffect } from "react"

export default function SessionVerifier() {
    const router = useRouter()
    const { data: session } = useSession()

    const logout = useCallback(() => {
        console.error("There was an error with the session, logging out...")

        deleteSession()
            .then(response => console.log(response.message))
            .catch(console.error)
            .finally(async () => {
                signOut({ redirect: false }).then(() => {
                    router.push(`${window.location.origin}/auth/login` as Route<string>)
                })
            })
    }, [router])

    useEffect(() => {
        if (session?.error === "RefreshAccessTokenError") logout()
    }, [session, logout])

    return <></>
}
