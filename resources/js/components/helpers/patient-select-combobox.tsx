import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Field } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounceCallback } from '@/hooks/use-debounce-callback';
import { cn } from '@/lib/utils';
import { simpleSearch } from '@/routes/patient_info';
import { PatientInfo } from '@/types/application/patient';
import { Check, ChevronsUpDownIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useCallback, useEffect, useState, useTransition } from 'react';

interface PatientSelectComboboxProps {
    setPatientId: Dispatch<SetStateAction<string | null>>;
    error?: string;
    size?: 'sm' | 'md' | 'lg' | 'full';
}

type SimplePatientInfo = Pick<PatientInfo, 'id' | 'full_name'>;

export default function PatientSelectCombobox({
    setPatientId,
    error,
    size = 'sm',
}: Readonly<PatientSelectComboboxProps>) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | null>(null);
    const [patients, setPatients] = useState<SimplePatientInfo[]>([]);
    const [isPending, startTransition] = useTransition();

    const performSearch = useCallback((q: string) => {
        startTransition(async () => {
            const url = simpleSearch({ mergeQuery: { q, medical_record_is_null: true } }).url;
            const res = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });

            if (!res.ok) {
                setPatients([]);
                return;
            }

            const json = await res.json();
            const items: SimplePatientInfo[] = json?.data ?? json ?? [];

            setPatients(items);
        });
    }, []);

    const debouncedSearch = useDebounceCallback(performSearch, 300);

    useEffect(() => {
        debouncedSearch('');
        return () => debouncedSearch.cancel();
    }, [debouncedSearch]);

    return (
        <Field className={`max-w-${size}`}>
            <Label htmlFor="patient_info_id">Select Patient</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button type="button" variant="outline" aria-expanded={open} className="justify-between">
                        {value ?? 'Search for a patient...'}
                        <ChevronsUpDownIcon aria-hidden className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 duration-400 data-[state=open]:slide-in-from-bottom-10 data-[state=open]:zoom-in-100">
                    <Command>
                        <CommandInput
                            placeholder="Search patient..."
                            className="h-9"
                            onValueChange={(val) => debouncedSearch(val)}
                        />
                        <CommandList>
                            <CommandEmpty>{isPending ? 'Searching...' : 'No Patient Found...'}</CommandEmpty>
                            <CommandGroup>
                                {patients.map((patient) => (
                                    <CommandItem
                                        key={patient.id}
                                        value={`${patient.id}__${patient.full_name}`}
                                        onSelect={(currentValue) => {
                                            const [idPart, ...nameParts] = currentValue.split('__');
                                            const id = Number(idPart);
                                            const name = nameParts.join('__');
                                            const found = patients.find((p) => p.id === id);

                                            setValue(found ? name : '');
                                            setPatientId(found ? String(found.id) : null);
                                            setOpen(false);
                                        }}
                                    >
                                        <span>{patient.full_name}</span>
                                        <Check
                                            aria-hidden
                                            size={16}
                                            className={cn(
                                                'ml-auto',
                                                value === patient.full_name ? 'opacity-100' : 'opacity-0',
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <InputError message={error} className="mt-2" />
        </Field>
    );
}
