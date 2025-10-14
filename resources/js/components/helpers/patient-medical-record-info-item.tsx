import HeadingSmall from '@/components/heading-small';
import { Item, ItemContent, ItemHeader } from '@/components/ui/item';
import { MedicalRecord } from '@/types/application/medicalRecord';
import { format } from 'date-fns';
import { CalendarPlus2Icon, CalendarSyncIcon } from 'lucide-react';

interface PatientMedicalRecordInfoItemProps {
    medicalRecord: Partial<MedicalRecord> | null;
}

export default function PatientMedicalRecordInfoItem({ medicalRecord }: Readonly<PatientMedicalRecordInfoItemProps>) {
    if (!medicalRecord) return null;

    const formatedCreatedAt = format(String(medicalRecord.created_at), 'PPP p');
    const formatedUpdatedAt = format(String(medicalRecord.updated_at), 'PPP p');

    const createdAtLabel = `Created at ${formatedCreatedAt}`;
    const updatedAtLabel = `Last updated at ${formatedUpdatedAt}`;

    return (
        <Item variant="outline">
            <ItemHeader>
                <HeadingSmall title="Medical Record" description="The medical record details of the patient." />
            </ItemHeader>

            <ItemContent>
                <div className="mx-auto mb-4 flex flex-wrap gap-2">
                    <time
                        dateTime={String(medicalRecord.created_at)}
                        className="inline-flex items-center gap-x-2 text-sm text-muted-foreground/70"
                        aria-label={createdAtLabel}
                        title={createdAtLabel}
                    >
                        <CalendarPlus2Icon aria-hidden size={16} />
                        {formatedCreatedAt}
                    </time>
                    <time
                        dateTime={String(medicalRecord.updated_at)}
                        className="inline-flex items-center gap-x-2 text-sm text-muted-foreground/70"
                        aria-label={updatedAtLabel}
                        title={updatedAtLabel}
                    >
                        <CalendarSyncIcon aria-hidden size={16} />
                        {formatedUpdatedAt}
                    </time>
                </div>
                <div
                    className="mx-auto prose rounded-lg bg-card px-3 py-1.5 dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: medicalRecord.medical_notes_html! }}
                />
            </ItemContent>
        </Item>
    );
}
