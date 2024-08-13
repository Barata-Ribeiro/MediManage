"use client"

import { useUser } from "@/context/user-context-provider"
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from "@headlessui/react"
import { Fragment } from "react"
import { twMerge } from "tailwind-merge"
import { FaBars, FaBell, FaUserDoctor, FaUserInjured, FaUserNurse, FaUserTie, FaX } from "react-icons/fa6"
import { usePathname } from "next/navigation"
import Link from "next/link"
import miniLogo from "../../../public/images/medimanage-mini.svg"
import Image from "next/image"

export default function Header() {
    const data = useUser()
    const pathname = usePathname()

    const encodedName = encodeURIComponent(data.user?.username ?? "")
    const userIsAdmin = data.user?.accountType === "ADMINISTRATOR"
    const userIsDoctor = data.user?.accountType === "DOCTOR"
    const userIsAssistant = data.user?.accountType === "ASSISTANT"
    // const userIsPatient = data.user?.accountType === "PATIENT"

    const navigation = [
        { name: "Dashboard", href: "/dashboard/" + encodedName, condition: true },
        { name: "Users", href: "/dashboard/" + encodedName + "/users", condition: userIsAdmin },
        { name: "Notices", href: "/dashboard/" + encodedName + "/notices", condition: userIsAdmin },
        {
            name: "Consultations",
            href: "/dashboard/" + encodedName + "/consultations",
            condition: userIsDoctor || userIsAssistant,
        },
        { name: "Records", href: "/dashboard/" + encodedName + "/records", condition: userIsDoctor || userIsAssistant },
        { name: "Articles", href: "/dashboard/" + encodedName + "/articles", condition: userIsDoctor || userIsAdmin },
    ]

    const userNavigation = [
        { name: "Settings", href: "/dashboard/" + encodedName + "/settings" },
        { name: "Sign out", href: "/dashboard/" + encodedName + "/sign-out" },
    ]

    function getUserIcon(userIsAdmin: boolean, userIsDoctor: boolean, userIsAssistant: boolean) {
        if (userIsAdmin) return <FaUserTie size={24} />
        else if (userIsDoctor) return <FaUserDoctor size={24} />
        else if (userIsAssistant) return <FaUserNurse size={24} />
        else return <FaUserInjured size={24} />
    }

    return (
        <div className="bg-mourning-blue-800 pb-32">
            <Disclosure as="nav" className="bg-mourning-blue-800">
                {({ open }) => (
                    <>
                        <div className="container font-heading sm:px-6 lg:px-8">
                            <div className="border-b border-neutral-700">
                                <div className="flex h-16 items-center justify-between px-4 sm:px-0">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <Image
                                                alt="MediManage logo"
                                                src={miniLogo}
                                                className="h-8 w-full object-cover"
                                                priority
                                            />
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="ml-10 flex items-baseline space-x-4">
                                                {navigation
                                                    .filter(item => item.condition)
                                                    .map(item => (
                                                        <a
                                                            key={item.name}
                                                            href={item.href}
                                                            className={twMerge(
                                                                pathname.endsWith(item.href)
                                                                    ? "bg-mourning-blue-900 text-neutral-50"
                                                                    : "text-neutral-300 hover:bg-mourning-blue-700 hover:text-neutral-50",
                                                                "rounded-md px-3 py-2 text-sm font-medium",
                                                            )}
                                                            aria-current={
                                                                pathname.endsWith(item.href) ? "page" : undefined
                                                            }>
                                                            {item.name}
                                                        </a>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-4 flex items-center md:ml-6">
                                            <button
                                                type="button"
                                                className="rounded-full bg-mourning-blue-800 p-1 text-neutral-400 hover:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                <span className="sr-only">View notifications</span>
                                                <FaBell className="h-6 w-6" aria-hidden="true" />
                                            </button>

                                            {/* Profile dropdown */}
                                            <Menu as="div" className="relative ml-3">
                                                <div>
                                                    <MenuButton className="flex max-w-xs items-center rounded-full bg-mourning-blue-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                        <span className="sr-only">Open user menu</span>
                                                        <span
                                                            id="avatar"
                                                            className="rounded-full bg-neutral-100 p-1 align-middle leading-none">
                                                            {getUserIcon(userIsAdmin, userIsDoctor, userIsAssistant)}
                                                        </span>
                                                    </MenuButton>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95">
                                                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-neutral-50 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        {userNavigation.map(item => (
                                                            <MenuItem key={item.name}>
                                                                {({ focus }) => (
                                                                    <Link
                                                                        href={item.href}
                                                                        className={twMerge(
                                                                            focus ? "bg-mourning-blue-100" : "",
                                                                            "block px-4 py-2 text-sm text-neutral-700",
                                                                        )}>
                                                                        {item.name}
                                                                    </Link>
                                                                )}
                                                            </MenuItem>
                                                        ))}
                                                    </MenuItems>
                                                </Transition>
                                            </Menu>
                                        </div>
                                    </div>
                                    <div className="-mr-2 flex md:hidden">
                                        {/* Mobile menu button */}
                                        <DisclosureButton className="inline-flex items-center justify-center rounded-md bg-mourning-blue-800 p-2 text-neutral-400 hover:bg-mourning-blue-700 hover:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="sr-only">Open main menu</span>
                                            {open ? (
                                                <FaX className="block h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <FaBars className="block h-6 w-6" aria-hidden="true" />
                                            )}
                                        </DisclosureButton>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DisclosurePanel className="border-b border-neutral-700 font-heading md:hidden">
                            <div className="space-y-1 px-2 py-3 sm:px-3">
                                {navigation
                                    .filter(item => item.condition)
                                    .map(item => (
                                        <DisclosureButton
                                            key={item.name}
                                            as="a"
                                            href={item.href}
                                            className={twMerge(
                                                pathname.endsWith(item.href)
                                                    ? "bg-mourning-blue-900 text-neutral-50"
                                                    : "text-neutral-300 hover:bg-mourning-blue-700 hover:text-neutral-50",
                                                "block rounded-md px-3 py-2 text-base font-medium",
                                            )}
                                            aria-current={pathname.endsWith(item.href) ? "page" : undefined}>
                                            {item.name}
                                        </DisclosureButton>
                                    ))}
                            </div>
                            <div className="border-t border-neutral-700 pb-3 pt-4">
                                <div className="flex items-center px-5">
                                    <div className="flex-shrink-0">
                                        <span id="avatar" className="h-10 w-10 rounded-full leading-none">
                                            {getUserIcon(userIsAdmin, userIsDoctor, userIsAssistant)}
                                        </span>
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium leading-none text-neutral-50">
                                            {data.user?.username}
                                        </div>
                                        <div className="text-sm font-medium leading-none text-neutral-400">
                                            {data.user?.email}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="ml-auto flex-shrink-0 rounded-full bg-mourning-blue-800 p-1 text-neutral-400 hover:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                        <span className="sr-only">View notifications</span>
                                        <FaBell className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="mt-3 space-y-1 px-2">
                                    {userNavigation.map(item => (
                                        <DisclosureButton
                                            key={item.name}
                                            as="a"
                                            href={item.href}
                                            className="block rounded-md px-3 py-2 text-base font-medium text-neutral-400 hover:bg-mourning-blue-700 hover:text-neutral-50">
                                            {item.name}
                                        </DisclosureButton>
                                    ))}
                                </div>
                            </div>
                        </DisclosurePanel>
                    </>
                )}
            </Disclosure>

            <header className="py-10">
                <div className="container px-4 sm:px-6 lg:px-8">
                    <h1 className="font-heading text-3xl font-bold tracking-tight text-neutral-50">
                        Wellcome, {data.user?.fullName ?? data.user?.username}
                    </h1>
                </div>
            </header>
        </div>
    )
}
