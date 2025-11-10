import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { FileUserIcon } from 'lucide-react';

export default function NoContract() {
    return (
        <Empty className="border border-dashed">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <FileUserIcon aria-hidden />
                </EmptyMedia>
                <EmptyTitle>No Contract Found</EmptyTitle>
                <EmptyDescription>
                    This employee does not have any contract assigned yet. Please add a contract to proceed.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button size="sm">
                    {/* TODO: Implement route link to create contract */}
                    Add Contract
                </Button>
            </EmptyContent>
        </Empty>
    );
}
