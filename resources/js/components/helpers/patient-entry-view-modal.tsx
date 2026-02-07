import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal, ModalBody, ModalContent, ModalTrigger } from '@/components/ui/shadcn-io/animated-modal';
import { normalizeString } from '@/lib/utils';
import { MedicalRecordEntry } from '@/types/application/medicalRecord';
import { format } from 'date-fns';
import { ViewIcon } from 'lucide-react';
export default function PatientEntryViewModal({ entry }: Readonly<{ entry: MedicalRecordEntry }>) {
    return (
        <Modal>
            <ModalTrigger className="group">
                <Button variant="outline" size="icon" title="View Entry" aria-label="View Entry" asChild>
                    <span aria-hidden>
                        <ViewIcon className="group-hover:animate-pulse" />
                    </span>
                </Button>
            </ModalTrigger>

            <ModalBody>
                <ModalContent>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">{entry.title ?? 'Untitled'}</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                            <Badge variant="outline" className="capitalize select-none">
                                {normalizeString(entry.entry_type)}
                            </Badge>

                            <Badge variant="outline" className="capitalize select-none">
                                {entry.is_visible_to_patient ? 'Visible to patient' : 'Private'}
                            </Badge>

                            <span className="text-xs">
                                Created:{' '}
                                <time dateTime={new Date(entry.created_at).toISOString()}>
                                    {format(new Date(entry.created_at), 'PPP')}
                                </time>
                            </span>

                            <span className="text-xs">
                                Updated:{' '}
                                <time dateTime={new Date(entry.updated_at).toISOString()}>
                                    {format(new Date(entry.updated_at), 'PPP')}
                                </time>
                            </span>
                        </div>
                    </div>

                    <div
                        className="prose dark:prose-invert max-w-full whitespace-normal"
                        dangerouslySetInnerHTML={{
                            __html: entry.content_html ?? '<p>No content available.</p>',
                        }}
                    />
                </ModalContent>
            </ModalBody>
        </Modal>
    );
}
