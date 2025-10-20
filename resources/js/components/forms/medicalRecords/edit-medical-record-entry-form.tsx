import medicalRecordController from '@/actions/App/Http/Controllers/Medical/MedicalRecordController';
import { Editor } from '@/components/blocks/editor-x/editor';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { htmlToLexical } from '@/lib/html-to-lexical';
import { normalizeString } from '@/lib/utils';
import { MedicalRecordEntryType } from '@/types/application/enums';
import { MedicalRecordEntry } from '@/types/application/medicalRecord';
import { Form } from '@inertiajs/react';
import { SerializedEditorState } from 'lexical';
import { useState } from 'react';

export default function EditMedicalRecordEntryForm({
    medicalRecordEntry,
}: Readonly<{ medicalRecordEntry: MedicalRecordEntry }>) {
    const initialEditorState: SerializedEditorState = medicalRecordEntry.content_json
        ? (JSON.parse(medicalRecordEntry.content_json) as SerializedEditorState)
        : htmlToLexical(medicalRecordEntry.content_html);
    const [isVisibleToPatient, setIsVisibleToPatient] = useState(medicalRecordEntry.is_visible_to_patient);
    const [editorState, setEditorState] = useState<SerializedEditorState>(initialEditorState);

    const entryTypes = Object.values(MedicalRecordEntryType).map((v) => ({
        value: String(v),
        label: normalizeString(String(v)),
    }));

    return (
        <Form
            {...medicalRecordController.updateEntry.form({
                medicalRecord: medicalRecordEntry.medical_record_id,
                medicalRecordEntry: medicalRecordEntry.id,
            })}
            options={{ preserveScroll: true }}
            transform={(data) => ({
                ...data,
                is_visible_to_patient: isVisibleToPatient,
                content_json: JSON.stringify(editorState),
                content_html: medicalRecordEntry.content_html,
            })}
            className="space-y-6 inert:pointer-events-none inert:opacity-50"
            disableWhileProcessing
        >
            {({ errors }) => (
                <>
                    <Field>
                        <FieldLabel htmlFor="title">Title</FieldLabel>
                        <Input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="e.g. Annual Checkup Notes"
                            defaultValue={medicalRecordEntry.title}
                            aria-invalid={Boolean(errors.title)}
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </Field>

                    <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
                        <div className="flex flex-row items-center justify-between rounded-lg border bg-background p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FieldLabel htmlFor="is_visible_to_patient">
                                    {isVisibleToPatient ? 'Patient Can See' : 'Patient Cannot See'}
                                </FieldLabel>
                                <p className="text-sm text-muted-foreground">
                                    {isVisibleToPatient
                                        ? 'The patient will be able to view this entry in their records.'
                                        : 'The patient will not be able to view this entry in their records.'}
                                </p>
                            </div>

                            <Switch
                                id="is_visible_to_patient"
                                name="is_visible_to_patient"
                                checked={isVisibleToPatient}
                                onCheckedChange={setIsVisibleToPatient}
                            />
                        </div>

                        <Field>
                            <FieldLabel>Entry Type</FieldLabel>
                            <Select defaultValue={medicalRecordEntry.entry_type} name="entry_type">
                                <SelectTrigger>
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
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel>Content</FieldLabel>
                        <Editor
                            editorSerializedState={editorState}
                            onSerializedChange={(value) => setEditorState(value)}
                        />

                        <InputError message={errors.content_html || errors.content_json} className="mt-2" />
                    </Field>

                    <Button type="submit">Update</Button>
                </>
            )}
        </Form>
    );
}
