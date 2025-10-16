import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger } from '@/components/ui/shadcn-io/animated-modal';
import { MedicalRecordEntry } from '@/types/application/medicalRecord';
import { format } from 'date-fns';
import { ExternalLinkIcon } from 'lucide-react';

export default function MedicalEntryModal(entry: Readonly<MedicalRecordEntry>) {
    // TODO: Replace trigger with a proper button
    return (
        <Modal>
            <ModalTrigger className="group">
                <Item variant="outline" className="group-hover:bg-card">
                    <ItemContent>
                        <ItemTitle>{entry.title}</ItemTitle>
                        <ItemDescription className="inline-flex h-4 items-center text-sm text-muted-foreground capitalize">
                            {entry.entry_type}
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            {format(entry.created_at, 'PPP')}
                        </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        <ExternalLinkIcon aria-hidden size={16} />
                    </ItemActions>
                </Item>
            </ModalTrigger>
            <ModalBody>
                <ModalContent>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: entry.content_html,
                        }}
                    />
                </ModalContent>

                <ModalFooter className="gap-4">
                    {/* TODO: Add go to edit entry page */}
                    <Button variant="secondary">Modify</Button>
                </ModalFooter>
            </ModalBody>
        </Modal>
    );
}
