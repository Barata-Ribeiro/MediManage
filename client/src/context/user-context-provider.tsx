"use client"

import {
    createContext,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"
import { User } from "@/interfaces/users"

interface UserContextProviderProps {
    children: ReactNode
    user: User | null
}

interface UserContextType {
    user: User | null
    setUser: Dispatch<SetStateAction<User | null>>
}

const UserContext = createContext<UserContextType | null>(null)

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) throw new Error("useContext must be used within a UserContextProvider.")

    return context
}

export function UserContextProvider({ children, user }: Readonly<UserContextProviderProps>) {
    const [currentUser, setCurrentUser] = useState<User | null>(user)
    const userContextMemo = useMemo(
        () => ({
            user: currentUser,
            setUser: setCurrentUser,
        }),
        [currentUser],
    )

    useEffect(() => {
        setCurrentUser(user)
    }, [currentUser, user])

    return <UserContext.Provider value={userContextMemo}>{children}</UserContext.Provider>
}
