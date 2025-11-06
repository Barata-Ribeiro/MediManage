import DeleteUser from '@/components/admin/delete-user';
import EditUserForm from '@/components/forms/admin/roles/users/edit-user-form';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Layout from '@/layouts/app-layout';
import users from '@/routes/admin/users';
import type { BreadcrumbItem } from '@/types';
import { User } from '@/types/admin/users';
import { Head } from '@inertiajs/react';

export default function Edit({ user }: Readonly<{ user: User }>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: users.index().url,
        },
        {
            title: `View '${user.name}'`,
            href: users.show(user.id).url,
        },
        {
            title: `Edit '${user.name}'`,
            href: users.edit(user.id).url,
        },
    ];

    const label = `You are currently editing the user '${user.name}', please make sure the information is correct.`;

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`User — ${user?.name ?? 'Edit'}`} />

            <section className="container py-4 sm:py-6">
                <Card className="mx-auto w-full max-w-3xl">
                    <CardHeader className="border-b">
                        <Heading title="Edit User" description={label} />
                    </CardHeader>

                    <CardContent>
                        <EditUserForm user={user} />
                    </CardContent>
                </Card>

                <Card className="mx-auto mt-6 w-full max-w-3xl">
                    <CardHeader className="border-b">
                        <Heading title="Danger Zone" description="Delete this user account and all of its data." />
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                            <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                                <p className="font-medium">Warning</p>
                                <p className="text-sm">Please proceed with caution, this cannot be undone.</p>
                            </div>
                            <DeleteUser user={user} />
                        </div>
                    </CardContent>
                </Card>
            </section>
        </Layout>
    );
}
