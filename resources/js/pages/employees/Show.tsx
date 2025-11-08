import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useInitials } from '@/hooks/use-initials';
import Layout from '@/layouts/app-layout';
import employee_info from '@/routes/employee_info';
import { BreadcrumbItem } from '@/types';
import { EmployeeInfoWithRelations } from '@/types/application/employee';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { CakeIcon, FingerprintIcon, MailCheckIcon, MailIcon, PhoneIcon } from 'lucide-react';

export default function Show({ employee: data }: Readonly<{ employee: EmployeeInfoWithRelations }>) {
    const getInitials = useInitials();
    const { user, contracts, ...rest } = data;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Employees',
            href: employee_info.index().url,
        },
        {
            title: `${rest.full_name}`,
            href: employee_info.show(data.id).url,
        },
    ];

    // TODO: Remove console logs after finishing page implementation
    console.group('Employee Details');
    console.log('User Data:', user);
    console.log('Contracts:', contracts);
    console.log('Employee Info:', rest);
    console.groupEnd();

    const dateOfBirth = String(rest?.date_of_birth).replaceAll('-', '/');

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={rest.full_name} />

            <article className="container py-2">
                <header className="flex flex-wrap items-center gap-4 rounded-lg border p-6">
                    <Avatar className="size-22">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-2xl">{getInitials(rest.full_name!)}</AvatarFallback>
                    </Avatar>

                    <div className="grid gap-2">
                        <h1 className="inline-flex items-center gap-2 text-2xl font-bold">
                            {rest.position === 'Doctor' && <span className="text-primary">Dr.</span>} {rest.full_name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground/70 [&>span]:inline-flex [&>span]:items-center [&>span]:gap-x-1">
                            <span>
                                <MailIcon size={16} aria-hidden /> {user?.email ?? 'N/A'}
                            </span>
                            <span className="">
                                <MailCheckIcon size={16} aria-hidden />
                                {user?.email_verified_at
                                    ? `Verified in ${format(user.email_verified_at, 'PPP')}`
                                    : 'Not Verified'}
                            </span>
                            <span>
                                <PhoneIcon size={16} aria-hidden /> {rest.phone_number ?? 'N/A'}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground/70 [&>span]:inline-flex [&>span]:items-center [&>span]:gap-x-1">
                            <span>
                                <CakeIcon size={16} aria-hidden /> {format(dateOfBirth, 'PPP')} ({rest.age} years)
                            </span>

                            <Badge
                                variant={user?.two_factor_confirmed_at ? 'default' : 'destructive'}
                                className="select-none"
                            >
                                <FingerprintIcon size={16} aria-hidden />{' '}
                                {user?.two_factor_confirmed_at ? '2FA Enabled' : '2FA Disabled'}
                            </Badge>

                            <Badge variant={rest.is_active ? 'default' : 'destructive'} className="select-none">
                                {rest.is_active ? 'Active Employee' : 'Inactive Employee'}
                            </Badge>
                        </div>
                    </div>
                </header>

                {/* TODO: Employee Details Content Goes Here */}
            </article>
        </Layout>
    );
}
