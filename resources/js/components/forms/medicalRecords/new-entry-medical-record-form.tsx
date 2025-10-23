import { Editor } from '@/components/blocks/editor-x/editor';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { lexicalToHtml } from '@/lib/lexical-to-html';
import { normalizeString } from '@/lib/utils';
import medicalRecords from '@/routes/medicalRecords';
import { Appointment } from '@/types/application/appointment';
import { MedicalRecordEntryType } from '@/types/application/enums';
import { Form } from '@inertiajs/react';
import { format } from 'date-fns';
import { SerializedEditorState } from 'lexical';
import { useState } from 'react';

interface NewEntryMedicalRecordFormProps {
    medicalRecordId: number;
    appointments: Appointment[];
}

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

const entryTypes = Object.values(MedicalRecordEntryType).map((v) => ({
    value: String(v),
    label: normalizeString(String(v)),
}));

export default function NewEntryMedicalRecordForm({
    medicalRecordId,
    appointments,
}: Readonly<NewEntryMedicalRecordFormProps>) {
    const [editorState, setEditorState] = useState<SerializedEditorState>(initialValue);
    const [isVisibleToPatient, setIsVisibleToPatient] = useState(false);

    return (
        <Form
            {...medicalRecords.entries.store.form(medicalRecordId)}
            options={{ preserveScroll: true }}
            className="space-y-6 inert:pointer-events-none inert:opacity-50"
            transform={(data) => ({
                ...data,
                content_json: JSON.stringify(editorState),
                content_html: lexicalToHtml(editorState),
                is_visible_to_patient: isVisibleToPatient,
            })}
            disableWhileProcessing
        >
            {({ errors }) => (
                <>
                    <Field>
                        <FieldLabel htmlFor="title">Title</FieldLabel>
                        <Input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Entry Title"
                            aria-invalid={!!errors.title}
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </Field>

                    <Field>
                        <FieldLabel>Content</FieldLabel>

                        <Editor
                            editorSerializedState={editorState}
                            onSerializedChange={(value) => setEditorState(value)}
                        />

                        <InputError message={errors.content_html ?? errors.content_json} className="mt-2" />
                    </Field>

                    <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
                        <div
                            {...(!!errors.is_visible_to_patient && { 'aria-invalid': 'true' })}
                            className="flex flex-row items-center justify-between rounded-lg border bg-background p-3 shadow-sm aria-invalid:border-destructive"
                        >
                            <div className="space-y-0.5">
                                <FieldLabel htmlFor="is_visible_to_patient">
                                    {isVisibleToPatient ? 'Patient Can See' : 'Patient Cannot See'}
                                </FieldLabel>
                                <p className="text-sm text-muted-foreground">
                                    {isVisibleToPatient
                                        ? 'The patient will be able to view this entry in their records.'
                                        : 'The patient will not be able to view this entry in their records.'}
                                </p>

                                <InputError message={errors.is_visible_to_patient} className="mt-2" />
                            </div>

                            <Switch
                                id="is_visible_to_patient"
                                name="is_visible_to_patient"
                                checked={isVisibleToPatient}
                                onCheckedChange={setIsVisibleToPatient}
                            />
                        </div>

                        <Field>
                            <FieldLabel htmlFor="entry_type">Entry Type</FieldLabel>
                            <Select name="entry_type">
                                <SelectTrigger id="entry_type" aria-invalid={!!errors.entry_type}>
                                    <SelectValue placeholder="Choose entry type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {entryTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <InputError message={errors.entry_type} className="mt-2" />
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="appointment_id">Associated Appointment</FieldLabel>
                        <RadioGroup
                            name="appointment_id"
                            id="appointment_id"
                            defaultValue={String(appointments[0]?.id)}
                        >
                            {appointments.map((appointment) => {
                                const rawDate = new Date(appointment.appointment_date);
                                const formattedDate = format(rawDate, 'PPPp');
                                const label = `Appointment on ${formattedDate} for ${appointment.reason_for_visit}`;
                                const formattedStatus = normalizeString(appointment.status);

                                return (
                                    <div
                                        className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50"
                                        key={appointment.id}
                                    >
                                        <RadioGroupItem
                                            value={String(appointment.id)}
                                            id={`appointment-${appointment.id}`}
                                            className="cursor-pointer"
                                            aria-label={label}
                                            title={label}
                                            aria-invalid={!!errors.appointment_id}
                                        />
                                        <Label
                                            htmlFor={`appointment-${appointment.id}`}
                                            className="grid w-full cursor-pointer gap-1.5"
                                        >
                                            <time dateTime={rawDate.toISOString()}>{formattedDate}</time>
                                            <span className="text-sm text-foreground/50">
                                                {appointment.reason_for_visit}
                                            </span>
                                            <Badge>{formattedStatus}</Badge>
                                        </Label>
                                    </div>
                                );
                            })}
                        </RadioGroup>

                        <InputError message={errors.appointment_id} className="mt-2" />
                    </Field>

                    <Button type="submit">Create</Button>
                </>
            )}
        </Form>
    );
}
