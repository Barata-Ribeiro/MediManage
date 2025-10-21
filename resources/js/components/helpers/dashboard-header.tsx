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
        <header className="flex flex-wrap items-center gap-4 rounded-lg border p-6" aria-labelledby="dashboard-heading">
            <Avatar className="size-22" aria-label={`Profile photo of ${fullName ?? 'user'}`}>
                <AvatarImage src={avatar} alt={fullName ?? 'Profile photo'} />
                <AvatarFallback className="text-2xl" aria-hidden>
                    {getInitials(fullName ?? 'user')}
                </AvatarFallback>
            </Avatar>

            <div className="grid gap-2">
                <h1 id="dashboard-heading" className="inline-flex items-center gap-2 text-2xl font-bold">
                    Welcome, {fullName ?? 'Guest'}
                </h1>

                <ul className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground/70 [&>li]:inline-flex [&>li]:items-center [&>li]:gap-x-1">
                    <li>
                        <MailIcon size={16} aria-hidden />
                        <a
                            href={email ? `mailto:${email}` : undefined}
                            className="underline-offset-2 hover:underline"
                            aria-label={email ? `Send email to ${email}` : 'Email not provided'}
                        >
                            {email}
                        </a>
                    </li>

                    <li>
                        <PhoneIcon size={16} aria-hidden />
                        <a
                            href={phoneNumber ? `tel:${phoneNumber}` : undefined}
                            className="underline-offset-2 hover:underline"
                            aria-label={phoneNumber ? `Call ${phoneNumber}` : 'Phone number not provided'}
                        >
                            {phoneNumber ?? '—'}
                        </a>
                    </li>

                    <li>
                        <CakeIcon size={16} aria-hidden />
                        <time
                            dateTime={new Date(formattedDateOfBirth).toISOString()}
                            aria-label={`Date of birth ${format(dateOfBirth, 'PPP')}`}
                        >
                            {format(dateOfBirth, 'PPP')} ({age ?? '—'} years)
                        </time>
                    </li>
                </ul>
            </div>
        </header>
    );
}
