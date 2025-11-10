import ContractItemListItem from '@/components/helpers/contract-item-list-item';
import EmployeeAccountInfoItem from '@/components/helpers/employee-account-info-item';
import EmployeePersonalInfoItem from '@/components/helpers/employee-personal-info-item';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

                <div id="tabs">
                    <Tabs defaultValue="personal" className="py-4">
                        <TabsList className="flex h-auto flex-wrap items-center justify-start space-y-1">
                            <TabsTrigger value="personal">Personal</TabsTrigger>
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="contracts">Contracts</TabsTrigger>
                        </TabsList>

                        <TabsContent value="personal">
                            <EmployeePersonalInfoItem employee={rest} dateOfBirth={dateOfBirth} />
                        </TabsContent>

                        <TabsContent value="account">
                            <EmployeeAccountInfoItem account={user!} />
                        </TabsContent>

                        <TabsContent value="contracts">
                            {(contracts?.length ?? 0) > 0 ? (
                                <ul className="mt-2 grid gap-4">
                                    {contracts!.map((contract) => (
                                        <ContractItemListItem key={contract.id} contract={contract} />
                                    ))}
                                </ul>
                            ) : (
                                <p>No contracts available.</p>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </article>
        </Layout>
    );
}
