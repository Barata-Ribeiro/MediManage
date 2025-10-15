import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { format } from 'date-fns';
import { CakeIcon, MailIcon, PhoneIcon } from 'lucide-react';

interface DashboardHeaderProps {
    avatar?: string;
    fullName?: string;
    email?: string;
    phoneNumber: string;
    dateOfBirth: Date;
    age?: number;
}

export default function DashboardHeader({
    avatar,
    fullName,
    email,
    phoneNumber,
    dateOfBirth,
    age,
}: Readonly<DashboardHeaderProps>) {
    const getInitials = useInitials();
    const formattedDateOfBirth = String(dateOfBirth).replaceAll('-', '/');

    return (
        <header className="flex items-center gap-4 rounded-lg border p-6">
            <Avatar className="size-22">
                <AvatarImage src={avatar} />
                <AvatarFallback className="text-2xl">{getInitials(fullName!)}</AvatarFallback>
            </Avatar>

            <div className="grid gap-2">
                <h1 className="inline-flex items-center gap-2 text-2xl font-bold">Wellcome, {fullName}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground/70 [&>span]:inline-flex [&>span]:items-center [&>span]:gap-x-1">
                    <span>
                        <MailIcon size={16} aria-hidden /> {email ?? 'N/A'}
                    </span>
                    <span>
                        <PhoneIcon size={16} aria-hidden /> {phoneNumber}
                    </span>
                    <span>
                        <CakeIcon size={16} aria-hidden /> {format(formattedDateOfBirth, 'PPP')} ({age} years)
                    </span>
                </div>
            </div>
        </header>
    );
}
