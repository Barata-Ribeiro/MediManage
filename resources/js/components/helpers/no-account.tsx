import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Link } from '@inertiajs/react';
import { UserRoundXIcon } from 'lucide-react';

export default function NoAccount() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <UserRoundXIcon aria-hidden />
                </EmptyMedia>
                <EmptyTitle>No Account</EmptyTitle>
                <EmptyDescription>No account found. An association is required to proceed.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button asChild>
                    {/* TODO: Add functionality to associate account */}
                    <Link href="#" as="button" prefetch="click">
                        Associate Account
                    </Link>
                </Button>
            </EmptyContent>
        </Empty>
    );
}
