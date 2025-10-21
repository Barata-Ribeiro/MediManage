import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { User } from '@/types/admin/users';
import { FileWarningIcon, MailIcon, ShieldUserIcon } from 'lucide-react';

interface UserDashboardHeaderProps {
    user: User;
}

export default function UserDashboardHeader({ user }: Readonly<UserDashboardHeaderProps>) {
    const getInitials = useInitials();

    const role = user.roles?.[0].name ?? 'No Role Assigned';
    const permissionCount = user.roles?.[0].permissions?.length ?? 0;

    return (
        <header className="flex items-center gap-4 rounded-lg border p-6" aria-labelledby="dashboard-heading">
            <Avatar className="size-22">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>

            <div className="grid gap-2">
                <h1 id="dashboard-heading" className="inline-flex items-center gap-2 text-2xl font-bold">
                    Welcome, {user.name}
                </h1>

                <ul className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground/70 [&>li]:inline-flex [&>li]:items-center [&>li]:gap-x-1">
                    <li>
                        <MailIcon size={16} aria-hidden />
                        <a
                            href={user.email ? `mailto:${user.email}` : undefined}
                            className="underline-offset-2 hover:underline"
                            aria-label={user.email ? `Send email to ${user.email}` : 'Email not provided'}
                        >
                            {user.email}
                        </a>
                    </li>
                    <li aria-label="User role and permission count">
                        <ShieldUserIcon size={16} aria-hidden />
                        <span>
                            {role} ({permissionCount} permissions)
                        </span>
                    </li>
                    <li className="text-destructive">
                        <FileWarningIcon aria-hidden size={16} />
                        No patient information available.
                    </li>
                </ul>
            </div>
        </header>
    );
}
