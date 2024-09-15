"use client"

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from "@headlessui/react"
import { useEffect, useState } from "react"
import { SimpleUser } from "@/interfaces/users"
import { HiMiniChevronUpDown } from "react-icons/hi2"
import getUserSearchSuggestions from "@/actions/users/get-user-search-suggestions"
import { FaCheck } from "react-icons/fa6"
import { useDebounce } from "@/hooks/use-debounce"

interface UserComboboxProps {
    type: "DOCTOR" | "ASSISTANT" | "PATIENT"
}

export default function UserCombobox({ type }: Readonly<UserComboboxProps>) {
    const [query, setQuery] = useState("")
    const debouncedQuery = useDebounce(query, 300)
    const [selectedPerson, setSelectedPerson] = useState<SimpleUser | null>(null)
    const [people, setPeople] = useState<SimpleUser[]>([])

    const entity = type.charAt(0) + type.slice(1).toLowerCase()

    useEffect(() => {
        if (debouncedQuery.length > 0 || query === "") {
            getUserSearchSuggestions(query ?? debouncedQuery, type)
                .then(res => {
                    if (res.ok) {
                        const data = res.response?.data as SimpleUser[]
                        setPeople(data)
                    } else {
                        console.error(res.error)
                    }
                })
                .catch(error => console.error(error))
        }
    }, [debouncedQuery, query, type])

    return (
        <Combobox
            value={selectedPerson}
            name={`${entity.toLowerCase()}`}
            onChange={person => setSelectedPerson(person)}
            onClose={() => setQuery("")}>
            <Label className="block text-sm font-medium leading-6 text-neutral-900">Select {entity}</Label>
            <div className="relative mt-2">
                <ComboboxInput
                    className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-400 focus:ring-2 focus:ring-inset focus:ring-mourning-blue-600 sm:text-sm sm:leading-6"
                    onChange={event => setQuery(event.target.value)}
                    onFocus={() => setQuery("")}
                    onBlur={() => setQuery("")}
                    displayValue={(person: SimpleUser) => (person ? person.fullName || person.username : "")}
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <HiMiniChevronUpDown className="h-5 w-5 text-neutral-500" aria-hidden="true" />
                </ComboboxButton>

                {people.length > 0 && (
                    <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {people.map(person => (
                            <ComboboxOption
                                key={person.id}
                                value={person}
                                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-neutral-900 data-[focus]:bg-mourning-blue-600 data-[focus]:text-white">
                                {({ selected }) => (
                                    <div className="flex">
                                        <span className={`truncate ${selected ? "font-semibold" : ""}`}>
                                            {person.fullName ?? "No Name"}
                                        </span>
                                        <span className="ml-2 truncate text-neutral-600 group-data-[focus]:text-mourning-blue-200">
                                            @{person.username}
                                        </span>
                                        {selected && (
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-mourning-blue-600 group-data-[focus]:text-white">
                                                <FaCheck className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        )}
                                    </div>
                                )}
                            </ComboboxOption>
                        ))}
                    </ComboboxOptions>
                )}
            </div>
        </Combobox>
    )
}
