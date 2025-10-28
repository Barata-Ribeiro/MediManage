import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Field } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounceCallback } from '@/hooks/use-debounce-callback';
import { cn } from '@/lib/utils';
import { doctorSimpleSearch } from '@/routes/employee_info';
import { EmployeeInfo } from '@/types/application/employee';
import { Check, ChevronsUpDownIcon, EraserIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useCallback, useEffect, useState, useTransition } from 'react';

interface DoctorSelectComboboxProps {
    setDoctorId: Dispatch<SetStateAction<string | null>>;
    error?: string;
    size?: 'sm' | 'md' | 'lg' | 'full';
}

type SimpleEmployeeInfo = Pick<EmployeeInfo, 'id' | 'full_name'>;

export default function DoctorSelectCombobox({ setDoctorId, error, size }: Readonly<DoctorSelectComboboxProps>) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | null>(null);
    const [doctors, setDoctors] = useState<SimpleEmployeeInfo[]>([]);
    const [isPending, startTransition] = useTransition();

    const performSearch = useCallback((q: string) => {
        startTransition(async () => {
            const url = doctorSimpleSearch({ query: { q } }).url;
            const res = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });

            if (!res.ok) {
                setDoctors([]);
                return;
            }

            const json = await res.json();
            const items: SimpleEmployeeInfo[] = json?.data ?? json ?? [];

            setDoctors(items);
        });
    }, []);

    const debouncedSearch = useDebounceCallback(performSearch, 300);

    useEffect(() => {
        debouncedSearch('');
        return () => debouncedSearch.cancel();
    }, [debouncedSearch]);

    return (
        <Field className={`max-w-${size}`}>
            <Label htmlFor="employee_info_id">Select Employee</Label>
            <ButtonGroup>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button type="button" variant="outline" aria-expanded={open} className="flex-1 justify-between">
                            {value ?? 'Search for an employee...'}
                            <ChevronsUpDownIcon aria-hidden className="opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 duration-400 data-[state=open]:slide-in-from-bottom-10 data-[state=open]:zoom-in-100">
                        <Command>
                            <CommandInput
                                placeholder="Search doctor..."
                                className="h-9"
                                onValueChange={(val) => debouncedSearch(val)}
                            />
                            <CommandList>
                                <CommandEmpty>{isPending ? 'Searching...' : 'No Doctor Found...'}</CommandEmpty>
                                <CommandGroup>
                                    {doctors.map((doctor) => (
                                        <CommandItem
                                            key={doctor.id}
                                            value={`${doctor.id}__${doctor.full_name}`}
                                            onSelect={(currentValue) => {
                                                const [idPart, ...nameParts] = currentValue.split('__');
                                                const id = Number(idPart);
                                                const name = nameParts.join('__');
                                                const found = doctors.find((e) => e.id === id);

                                                setValue(found ? name : '');
                                                setDoctorId(found ? String(found.id) : null);
                                                setOpen(false);
                                            }}
                                        >
                                            <span>{doctor.full_name}</span>
                                            <Check
                                                aria-hidden
                                                size={16}
                                                className={cn(
                                                    'ml-auto',
                                                    value === doctor.full_name ? 'opacity-100' : 'opacity-0',
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    aria-label="Clear selected doctor"
                    title="Clear selected doctor"
                    onClick={() => {
                        setValue(null);
                        setDoctorId(null);
                    }}
                >
                    <EraserIcon aria-hidden size={16} />
                </Button>
            </ButtonGroup>

            <InputError message={error} className="mt-2" />
        </Field>
    );
}
