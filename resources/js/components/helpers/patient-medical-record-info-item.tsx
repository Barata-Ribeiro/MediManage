import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Item, ItemContent, ItemHeader } from '@/components/ui/item';
import { cn } from '@/lib/utils';
import medicalRecords, { myRecord } from '@/routes/medicalRecords';
import { SharedData } from '@/types';
import { MedicalRecord } from '@/types/application/medicalRecord';
import { Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarPlus2Icon, CalendarSyncIcon } from 'lucide-react';

interface PatientMedicalRecordInfoItemProps {
    medicalRecord: Partial<MedicalRecord> | null;
}

export default function PatientMedicalRecordInfoItem({ medicalRecord }: Readonly<PatientMedicalRecordInfoItemProps>) {
    const { auth } = usePage<SharedData>().props;

    const hasPermissionToView = auth.roles.includes('Doctor') || auth.permissions.includes('medical_record.show');
    const isOwnerOfRecord = medicalRecord?.patient_info_id === auth.user.patient_info_id;
    const isNonOwnerAccess = hasPermissionToView && !isOwnerOfRecord;

    const buttonStyles = cn(
        'mx-auto mt-4 w-full max-w-sm',
        !hasPermissionToView || (!isOwnerOfRecord && 'pointer-events-none opacity-50'),
    );
    const linkHref = isNonOwnerAccess ? medicalRecords.show(medicalRecord?.patient_info_id ?? 0) : myRecord();

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

                <Button className={buttonStyles} asChild>
                    <Link href={linkHref} prefetch>
                        View Full Medical Record
                    </Link>
                </Button>
            </ItemContent>
        </Item>
    );
}
