import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { useInitials } from '@/hooks/use-initials';
import patient_info from '@/routes/patient_info';
import { PatientInfo } from '@/types/application/patient';
import { Link } from '@inertiajs/react';
import { ChevronsRightIcon } from 'lucide-react';

export default function PatientSimpleCard({ patient }: Readonly<{ patient: PatientInfo }>) {
    const getInitials = useInitials();

    return (
        <Item variant="outline">
            <ItemMedia>
                <Avatar>
                    <AvatarImage src={patient.user?.avatar} className="grayscale" />
                    <AvatarFallback>{getInitials(patient.full_name!)}</AvatarFallback>
                </Avatar>
            </ItemMedia>

            <ItemContent className="space-y-1">
                <ItemTitle>
                    {patient.full_name} ({patient.age} years old)
                </ItemTitle>
                <ItemDescription>{patient.user?.email ?? patient.phone_number}</ItemDescription>
            </ItemContent>

            <ItemActions>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="View patient details"
                    title="View patient details"
                    asChild
                >
                    <Link href={patient_info.show(patient.id)} as="button">
                        <ChevronsRightIcon aria-hidden />
                    </Link>
                </Button>
            </ItemActions>
        </Item>
    );
}
