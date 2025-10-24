import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import patient_info from '@/routes/patient_info';
import { Form } from '@inertiajs/react';

export default function PatientAssociateAccountModal({ id }: Readonly<{ id: number }>) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="button" variant="outline">
                    Associate Account
                </Button>
            </DialogTrigger>

            <DialogContent>
                <Form
                    {...patient_info.associateAccount.form(id)}
                    options={{ preserveScroll: true }}
                    className="space-y-4 inert:pointer-events-none inert:opacity-50"
                    disableWhileProcessing
                >
                    {({ errors }) => (
                        <>
                            <DialogHeader>
                                <DialogTitle>Associate Existing Account</DialogTitle>
                                <DialogDescription>
                                    Enter the email address of the existing account you wish to associate with this
                                    patient. Consult with the user if you are unsure of the email address.
                                </DialogDescription>
                            </DialogHeader>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    placeholder="e.g. johndoe@example.com"
                                    aria-invalid={!!errors.email}
                                    required
                                    aria-required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </Field>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="submit">Associate</Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
