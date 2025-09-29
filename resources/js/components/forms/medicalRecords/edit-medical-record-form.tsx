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
            className="space-y-6"
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-2">
                        <input
                            type="hidden"
                            name="medical_notes_html"
                            defaultValue={lexicalToHtml(editorState)}
                            required
                            readOnly
                        />

                        <input
                            type="hidden"
                            name="medical_notes_json"
                            defaultValue={JSON.stringify(editorState)}
                            required
                            readOnly
                        />

                        <Editor
                            editorSerializedState={editorState}
                            onSerializedChange={(value) => setEditorState(value)}
                        />

                        <InputError message={errors.medical_notes_html || errors.medical_notes_json} className="mt-2" />
                    </div>

                    <Button type="submit" disabled={processing}>
                        Update
                    </Button>
                </>
            )}
        </Form>
    );
}
