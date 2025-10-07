import medicalRecordController from '@/actions/App/Http/Controllers/Medical/MedicalRecordController';
import { Editor } from '@/components/blocks/editor-x/editor';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { lexicalToHtml } from '@/lib/lexical-to-html';
import { TablePatientInfo } from '@/types/application/patient';
import { Form } from '@inertiajs/react';
import { SerializedEditorState } from 'lexical';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export const initialValue = {
    root: {
        children: [
            {
                children: [],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1,
            },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
    },
} as unknown as SerializedEditorState;

export default function NewMedicalRecordForm() {
    const [editorState, setEditorState] = useState<SerializedEditorState>(initialValue);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | null>(null);
    const [patients, setPatients] = useState<TablePatientInfo[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

    const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const loadPatients = useCallback(async (q: string) => {
        try {
            setLoading(true);
            const url = medicalRecordController.patientSimpleSearch({ query: { q } }).url;
            const res = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });

            if (!res.ok) {
                setPatients([]);
                return;
            }

            const json = await res.json();
            const items: TablePatientInfo[] = json?.data ?? json ?? [];

            setPatients(items);
        } catch {
            setPatients([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => void loadPatients(''), [loadPatients]);

    // debounce query changes
    useEffect(() => {
        if (debounceRef.current) globalThis.clearTimeout(debounceRef.current);

        if (!query) {
            debounceRef.current = globalThis.setTimeout(() => void loadPatients(''), 150);
            return;
        }

        debounceRef.current = globalThis.setTimeout(() => void loadPatients(query), 300);

        return () => {
            if (debounceRef.current) globalThis.clearTimeout(debounceRef.current);
        };
    }, [query, loadPatients]);

    return (
        <Form
            {...medicalRecordController.store.form()}
            options={{
                preserveScroll: true,
            }}
            className="space-y-6 inert:pointer-events-none inert:opacity-50"
            transform={(data) => ({
                ...data,
                patient_info_id: selectedPatientId,
                medical_notes_json: JSON.stringify(editorState),
                medical_notes_html: lexicalToHtml(editorState),
            })}
            disableWhileProcessing
        >
            {({ errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="patient_info_id">Patient</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-[200px] justify-between"
                                >
                                    {value ?? 'Search for a patient...'}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Search patient..."
                                        className="h-9"
                                        onValueChange={(val: string) => setQuery(val)}
                                    />
                                    <CommandList>
                                        <CommandEmpty>{loading ? 'Searching...' : 'No Patient Found...'}</CommandEmpty>
                                        <CommandGroup>
                                            {patients.map((patient) => (
                                                <CommandItem
                                                    key={patient.id}
                                                    value={`${patient.id}__${patient.first_name} ${patient.last_name}`}
                                                    onSelect={(currentValue) => {
                                                        const [idPart, ...nameParts] = currentValue.split('__');
                                                        const id = Number(idPart);
                                                        const name = nameParts.join('__');
                                                        const found = patients.find((p) => p.id === id);

                                                        setValue(found ? name : '');
                                                        setSelectedPatientId(found ? found.id : null);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <span>
                                                        {patient.first_name} {patient.last_name}
                                                    </span>
                                                    <Check
                                                        className={`ml-auto h-4 w-4 ${selectedPatientId === patient.id ? 'opacity-100' : 'opacity-0'}`}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        <InputError message={errors.patient_info_id} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Editor
                            editorSerializedState={editorState}
                            onSerializedChange={(value) => setEditorState(value)}
                        />

                        <InputError message={errors.medical_notes_html ?? errors.medical_notes_json} className="mt-2" />
                    </div>

                    <Button type="submit">Create</Button>
                </>
            )}
        </Form>
    );
}
