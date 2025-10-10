import { Editor } from '@/components/blocks/editor-x/editor';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { htmlToLexical } from '@/lib/html-to-lexical';
import { lexicalToHtml } from '@/lib/lexical-to-html';
import { cn } from '@/lib/utils';
import prescriptions from '@/routes/prescriptions';
import { Prescription } from '@/types/application/prescription';
import { Form } from '@inertiajs/react';
import { format } from 'date-fns';
import { SerializedEditorState } from 'lexical';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

interface EditPatientPrescriptionFormProps {
    data: Prescription;
}

export default function EditPatientPrescriptionForm({ data }: Readonly<EditPatientPrescriptionFormProps>) {
    const initialEditorState: SerializedEditorState = data.prescription_details_json
        ? (JSON.parse(data.prescription_details_json) as SerializedEditorState)
        : htmlToLexical(data.prescription_details_html ?? '');

    const initialDateState = new Date(String(data.date_expires).replaceAll('-', '/'));

    const [editorState, setEditorState] = useState<SerializedEditorState>(initialEditorState);
    const [expirationDate, onExpirationChange] = useState<Date>(initialDateState);

    const prescriptionId = data.id;
    const doctorId = data.employee_info_id;
    const patientId = data.patient_info_id;

    return (
        <Form
            {...prescriptions.update.form({ doctor: doctorId, patientInfo: patientId, prescription: prescriptionId })}
            options={{ preserveScroll: true }}
            className="space-y-6 inert:pointer-events-none inert:opacity-50"
            transform={(data) => ({
                ...data,
                prescription_details_json: JSON.stringify(editorState),
                prescription_details_html: lexicalToHtml(editorState),
                date_expires: format(expirationDate, 'yyyy-MM-dd'),
            })}
            disableWhileProcessing
        >
            {({ errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="date_expires">New Expiration Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'pl-3 text-left font-normal',
                                        !expirationDate && 'text-muted-foreground',
                                    )}
                                >
                                    {expirationDate ? (
                                        format(expirationDate, 'PPP')
                                    ) : (
                                        <span>Choose new expiration</span>
                                    )}
                                    <CalendarIcon className="ml-auto size-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={expirationDate}
                                    onSelect={(date) => date && onExpirationChange(date)}
                                    disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                                    captionLayout="dropdown"
                                />
                            </PopoverContent>
                        </Popover>
                        <InputError id="error-date_expires" message={errors.date_expires} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Editor
                            editorSerializedState={editorState}
                            onSerializedChange={(value) => setEditorState(value)}
                        />

                        <InputError
                            message={errors.prescription_details_html || errors.prescription_details_json}
                            className="mt-2"
                        />
                    </div>

                    <Button type="submit">Update</Button>
                </>
            )}
        </Form>
    );
}
