import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { ClipboardListIcon } from 'lucide-react';

export default function NoMedicalRecord() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <ClipboardListIcon aria-hidden />
                </EmptyMedia>
                <EmptyTitle>No Medical Record</EmptyTitle>
                <EmptyDescription>
                    No medical record found. Wait for a doctor to create one upon the next consultation if necessary.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}
