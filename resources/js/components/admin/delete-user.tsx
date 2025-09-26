import UserManagementController from '@/actions/App/Http/Controllers/Admin/UserManagementController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/types/admin/users';
import { Form } from '@inertiajs/react';
import { useRef } from 'react';

export default function DeleteUser({ user }: Readonly<{ user: User }>) {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <Dialog modal>
            <DialogTrigger asChild>
                <Button variant="destructive">Delete User</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>
                    Are you sure you want to delete <span>{user.name}</span>&apos;s account?
                </DialogTitle>
                <DialogDescription>
                    Once the account is deleted, all of its resources and data will also be permanently deleted. Please
                    enter your password to confirm you would like to permanently delete this account.
                </DialogDescription>

                <Form
                    {...UserManagementController.destroy.form(user.id)}
                    options={{ preserveScroll: true }}
                    onError={() => passwordInput.current?.focus()}
                    resetOnSuccess
                    className="space-y-6"
                >
                    {({ resetAndClearErrors, processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="sr-only">
                                    Password
                                </Label>

                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    aria-invalid={Boolean(errors.password)}
                                />

                                <InputError message={errors.password} />
                            </div>

                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button autoFocus variant="outline" onClick={() => resetAndClearErrors()}>
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <Button type="submit" variant="destructive" disabled={processing}>
                                    Delete account
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
