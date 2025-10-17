import UserManagementController from '@/actions/App/Http/Controllers/Admin/UserManagementController';
import DeleteUser from '@/components/admin/delete-user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useInitials } from '@/hooks/use-initials';
import Layout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';
import { Role } from '@/types/admin/roles';
import { User } from '@/types/admin/users';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';

export default function Show({ user }: Readonly<{ user: User }>) {
    const getInitials = useInitials();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: UserManagementController.index().url,
        },
        {
            title: `View '${user.name}'`,
            href: UserManagementController.show(user.id).url,
        },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`User — ${user?.name ?? 'Show'}`} />

            <div className="container space-y-6 py-4 sm:py-6">
                <Card aria-labelledby="profile-title" className="mx-auto w-full max-w-3xl">
                    <CardHeader className="border-b pb-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="size-14">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                                </Avatar>

                                <div>
                                    <CardTitle id="profile-title" className="text-lg">
                                        {user?.name ?? '—'}
                                    </CardTitle>
                                    <CardDescription>{user?.email ?? '—'}</CardDescription>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {Array.isArray(user?.roles) && user.roles.length > 0 ? (
                                    user.roles.map((r: Role) => (
                                        <Badge key={r.id} className="capitalize">
                                            {r.name}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-sm text-muted-foreground">No roles</span>
                                )}
                            </div>
                        </div>

                        {user?.bio ? <p className="mt-3 text-sm text-muted-foreground">{user.bio}</p> : null}
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <h4 className="text-sm font-bold">Account</h4>

                                <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                                    <dl className="flex justify-between">
                                        <dt className="font-semibold text-foreground">Email</dt>
                                        <dd className="text-right">{user?.email ?? '—'}</dd>
                                    </dl>
                                    <dl className="flex justify-between">
                                        <dt className="font-semibold text-foreground">Verified</dt>
                                        <dd className="text-right">
                                            {user?.email_verified_at ? format(user.email_verified_at, 'PP') : 'No'}
                                        </dd>
                                    </dl>
                                    <dl className="flex justify-between">
                                        <dt className="font-semibold text-foreground">Two-factor</dt>
                                        <dd
                                            className={cn(
                                                'text-right',
                                                !user?.two_factor_confirmed_at && 'font-bold text-destructive',
                                            )}
                                        >
                                            {user?.two_factor_confirmed_at ? 'Enabled' : 'Disabled'}
                                        </dd>
                                    </dl>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold">Meta</h4>

                                <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                                    <dl className="flex justify-between">
                                        <dt className="font-semibold text-foreground">Created</dt>
                                        <dd className="text-right">{format(user?.created_at, 'PP')}</dd>
                                    </dl>
                                    <dl className="flex justify-between">
                                        <dt className="font-semibold text-foreground">Updated</dt>
                                        <dd className="text-right">{format(user?.updated_at, 'PP')}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="-mb-2 justify-end space-x-2 border-t pt-4">
                        <Button variant="outline" asChild>
                            <Link href={UserManagementController.index().url} prefetch>
                                Go Back
                            </Link>
                        </Button>

                        <Button asChild>
                            <Link href={UserManagementController.edit(user.id).url} prefetch>
                                Edit
                            </Link>
                        </Button>

                        <DeleteUser user={user} />
                    </CardFooter>
                </Card>

                <Card
                    aria-labelledby="profile-permissions-title"
                    aria-describedby="profile-permissions-desc"
                    className="mx-auto w-full max-w-3xl"
                >
                    <CardHeader className="border-b pb-4">
                        <CardTitle id="profile-permissions-title" className="text-lg">
                            Account Permissions
                        </CardTitle>
                        <CardDescription id="profile-permissions-desc">
                            View the permissions assigned to this user.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="flex flex-wrap gap-6">
                            {Array.isArray(user?.roles) && user.roles.length > 0 ? (
                                user.roles.map((role: Role) => (
                                    <div key={role.id} className="flex-1">
                                        <h4 className="text-md font-bold capitalize">{role.name}</h4>

                                        {Array.isArray(role.permissions) && role.permissions.length > 0 ? (
                                            <ul className="mt-2 list-disc space-y-1 divide-y pl-5 text-sm text-muted-foreground">
                                                {role.permissions.map((perm) => (
                                                    <li
                                                        key={perm.id}
                                                        className="flex items-baseline justify-between gap-3"
                                                    >
                                                        <span className="font-semibold text-foreground">
                                                            {perm.title}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground">
                                                            ({perm.name})
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                No permissions assigned.
                                            </p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">This user has no roles assigned.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
