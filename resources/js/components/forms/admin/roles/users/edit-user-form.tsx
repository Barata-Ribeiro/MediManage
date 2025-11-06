import UserManagementController from '@/actions/App/Http/Controllers/Admin/UserManagementController';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInitials } from '@/hooks/use-initials';
import users from '@/routes/admin/users';
import { User } from '@/types/admin/users';
import { Transition } from '@headlessui/react';
import { Form, Link } from '@inertiajs/react';

export default function EditUserForm({ user }: Readonly<{ user: User }>) {
    const getInitials = useInitials();

    return (
        <Form
            {...users.update.form(user.id)}
            options={{ preserveScroll: true }}
            disableWhileProcessing
            className="space-y-6 inert:pointer-events-none inert:opacity-50 inert:grayscale-100"
        >
            {({ recentlySuccessful, errors }) => (
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
                                <Link href={UserManagementController.show(user.id)} prefetch>
                                    Go back
                                </Link>
                            </Button>

                            <Button>Update</Button>
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
    );
}
