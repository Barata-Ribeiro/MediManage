import medicalRecordController from '@/actions/App/Http/Controllers/Medical/MedicalRecordController';
import { Editor } from '@/components/blocks/editor-x/editor';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { htmlToLexical } from '@/lib/html-to-lexical';
import { lexicalToHtml } from '@/lib/lexical-to-html';
import { Form } from '@inertiajs/react';
import { SerializedEditorState } from 'lexical';
import { useState } from 'react';

interface EditMedicalRecordFormProps {
    id: number;
    html: string;
    json?: string;
}

export default function EditMedicalRecordForm({ id, html, json }: Readonly<EditMedicalRecordFormProps>) {
    const initialEditorState: SerializedEditorState = json
        ? (JSON.parse(json) as SerializedEditorState)
        : htmlToLexical(html);

    const [editorState, setEditorState] = useState<SerializedEditorState>(initialEditorState);

    return (
        <Form
            {...medicalRecordController.update.form({ id })}
            options={{
                preserveScroll: true,
            }}
            className="space-y-6 inert:pointer-events-none inert:opacity-50"
            transform={(data) => ({
                ...data,
                medical_notes_json: JSON.stringify(editorState),
                medical_notes_html: lexicalToHtml(editorState),
            })}
            disableWhileProcessing
        >
            {({ errors }) => (
                <>
                    <div className="grid gap-2">
                        <Editor
                            editorSerializedState={editorState}
                            onSerializedChange={(value) => setEditorState(value)}
                        />

                        <InputError message={errors.medical_notes_html || errors.medical_notes_json} className="mt-2" />
                    </div>

                    <Button type="submit">Update</Button>
                </>
            )}
        </Form>
    );
}
