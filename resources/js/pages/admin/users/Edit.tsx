import UserManagementController                from '@/actions/App/Http/Controllers/Admin/UserManagementController';
import DeleteUser                              from '@/components/admin/delete-user';
import Heading                                 from '@/components/heading';
import InputError                              from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button }                              from '@/components/ui/button';
import { Card, CardContent, CardHeader }       from '@/components/ui/card';
import { Input }                               from '@/components/ui/input';
import { Label }                               from '@/components/ui/label';
import { Textarea }                            from '@/components/ui/textarea';
import { useInitials }                         from '@/hooks/use-initials';
import Layout                                  from '@/layouts/app-layout';
import type { BreadcrumbItem }                 from '@/types';
import { User }                                from '@/types/admin/users';
import { Transition }                          from '@headlessui/react';
import { Form, Head, Link }                    from '@inertiajs/react';

export default function Edit({ user }: Readonly<{ user: User }>) {
    const getInitials = useInitials();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: UserManagementController.index().url,
        },
        {
            title: 'Edit',
            href: UserManagementController.edit(user.id).url,
        },
    ];

    const label = `You are currently editing the user "${user.name}", please make sure the information is correct.`;

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`User — ${user?.name ?? 'Edit'}`} />

            <section className="container py-4 sm:py-6">
                <Card className="mx-auto w-full max-w-3xl">
                    <CardHeader className="border-b">
                        <Heading title="Edit User" description={label} />
                    </CardHeader>

                    <CardContent>
                        <Form
                            {...UserManagementController.update.form(user.id)}
                            options={{
                                preserveScroll: true,
                            }}
                            className="space-y-6"
                        >
                            {({ processing, recentlySuccessful, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name (username)</Label>

                                        <Input
                                            id="name"
                                            className="mt-1 block w-full"
                                            defaultValue={user.name}
                                            name="name"
                                            autoComplete="name"
                                            placeholder="Full name"
                                            aria-invalid={Boolean(errors.name)}
                                        />

                                        <InputError className="mt-2" message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>

                                        <Input
                                            type="email"
                                            id="email"
                                            className="mt-1 block w-full"
                                            defaultValue={user.email}
                                            name="email"
                                            autoComplete="email"
                                            placeholder="e.g. contact@example.com"
                                            aria-invalid={Boolean(errors.name)}
                                        />

                                        <InputError className="mt-2" message={errors.name} />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Avatar className="size-14">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                                        </Avatar>

                                        <div className="grid w-full gap-2">
                                            <Label htmlFor="avatar">Avatar</Label>

                                            <Input
                                                id="avatar"
                                                type="url"
                                                className="mt-1 block w-full"
                                                defaultValue={user.avatar}
                                                name="avatar"
                                                placeholder="e.g. https://example.com/avatar.jpg"
                                                aria-invalid={Boolean(errors.avatar)}
                                            />

                                            <InputError className="mt-2" message={errors.avatar} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="bio">Biography</Label>

                                        <Textarea
                                            id="bio"
                                            className="mt-1 block w-full"
                                            defaultValue={user.bio}
                                            name="bio"
                                            placeholder="Short biography about this user..."
                                            aria-invalid={Boolean(errors.bio)}
                                        />

                                        <InputError className="mt-2" message={errors.bio} />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="inline-flex items-center gap-x-2">
                                            <Button variant="ghost" asChild>
                                                <Link href={UserManagementController.index().url} prefetch>
                                                    Go back
                                                </Link>
                                            </Button>

                                            <Button disabled={processing}>Update</Button>
                                        </div>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-neutral-600">Saved</p>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Form>
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
