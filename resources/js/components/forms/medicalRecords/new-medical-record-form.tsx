import medicalRecordController from '@/actions/App/Http/Controllers/Medical/MedicalRecordController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Form } from '@inertiajs/react';

export default function NewMedicalRecordForm() {
    return (
        <Form
            {...medicalRecordController.store.form()}
            options={{
                preserveScroll: true,
            }}
            className="space-y-6"
        >
            {({ processing, errors }) => (
                <>
                    {/*TODO: Implement patient selection with search in combobox*/}

                    <div className="grid gap-2">
                        <input type="hidden" name="medical_notes_html" defaultValue={''} required readOnly />
                        <input
                            type="hidden"
                            name="medical_notes_json"
                            defaultValue={JSON.stringify('')}
                            required
                            readOnly
                        />
                        {/*TODO: Implement rich text editor for medical notes*/}
                        <InputError message={errors.medical_notes_html || errors.medical_notes_json} className="mt-2" />
                    </div>

                    <Button type="submit" disabled={processing}>
                        Create
                    </Button>
                </>
            )}
        </Form>
    );
}
