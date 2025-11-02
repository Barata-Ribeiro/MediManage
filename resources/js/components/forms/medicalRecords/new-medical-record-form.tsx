import medicalRecordController from '@/actions/App/Http/Controllers/Medical/MedicalRecordController';
import { Editor } from '@/components/blocks/editor-x/editor';
import PatientSelectCombobox from '@/components/helpers/patient-select-combobox';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { lexicalToHtml } from '@/lib/lexical-to-html';
import { Form } from '@inertiajs/react';
import { SerializedEditorState } from 'lexical';
import { useState } from 'react';

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
    const [patientId, setPatientId] = useState<string | null>(null);

    return (
        <Form
            {...medicalRecordController.store.form()}
            options={{ preserveScroll: true }}
            className="space-y-6 inert:pointer-events-none inert:opacity-50"
            transform={(data) => ({
                ...data,
                patient_info_id: patientId,
                medical_notes_json: JSON.stringify(editorState),
                medical_notes_html: lexicalToHtml(editorState),
            })}
            disableWhileProcessing
        >
            {({ errors }) => (
                <>
                    <PatientSelectCombobox setPatientId={setPatientId} error={errors.patient_info_id} size="md" />

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
