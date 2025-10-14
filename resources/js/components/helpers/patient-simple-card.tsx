import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { useInitials } from '@/hooks/use-initials';
import { PatientInfo } from '@/types/application/patient';
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
                {/*TODO: View patient details*/}
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="View patient details"
                    title="View patient details"
                >
                    <ChevronsRightIcon aria-hidden />
                </Button>
            </ItemActions>
        </Item>
    );
}
