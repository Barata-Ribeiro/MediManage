import PatientAssociateAccountModal from '@/components/forms/patients/patient-associate-account-modal';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import patient_info from '@/routes/patient_info';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { UserRoundXIcon } from 'lucide-react';

interface NoAccountProps {
    id?: number;
}

export default function NoAccount({ id }: Readonly<NoAccountProps>) {
    const { auth } = usePage<SharedData>().props;

    const hasPermissions = auth.permissions.includes('patient_info.create');

    const description = {
        true: 'No account found. An association is required to proceed. You can create one or associate an existing account.',
        false: 'No account found. Please contact an attendant in the clinic for assistance.',
    };

    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <UserRoundXIcon aria-hidden />
                </EmptyMedia>
                <EmptyTitle>No Account</EmptyTitle>
                <EmptyDescription>{hasPermissions ? description.true : description.false}</EmptyDescription>
            </EmptyHeader>
            {id && hasPermissions && (
                <EmptyContent className="flex-row flex-wrap justify-center">
                    <Button asChild>
                        <Link href={patient_info.newAccount(id)} as="button" prefetch="click">
                            New Account
                        </Link>
                    </Button>

                    <PatientAssociateAccountModal id={id} />
                </EmptyContent>
            )}
        </Empty>
    );
}
