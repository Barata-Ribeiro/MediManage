import medicalRecordController from '@/actions/App/Http/Controllers/Medical/MedicalRecordController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger } from '@/components/ui/shadcn-io/animated-modal';
import { normalizeString } from '@/lib/utils';
import { MedicalRecordEntry } from '@/types/application/medicalRecord';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { ViewIcon } from 'lucide-react';

export default function MedicalEntryModal(entry: Readonly<MedicalRecordEntry>) {
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
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <Badge variant="outline" className="capitalize">
                                {normalizeString(entry.entry_type)}
                            </Badge>

                            <Badge variant="outline">
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
                        className="prose max-w-full whitespace-normal dark:prose-invert"
                        dangerouslySetInnerHTML={{
                            __html: entry.content_html ?? '<p>No content available.</p>',
                        }}
                    />
                </ModalContent>

                <ModalFooter className="gap-4">
                    <Button variant="secondary" aria-label="Modify Entry" title="Modify Entry" asChild>
                        <Link
                            href={medicalRecordController.editEntry({
                                medicalRecord: entry.medical_record_id,
                                medicalRecordEntry: entry.id,
                            })}
                            as="button"
                        >
                            Modify
                        </Link>
                    </Button>
                </ModalFooter>
            </ModalBody>
        </Modal>
    );
}
