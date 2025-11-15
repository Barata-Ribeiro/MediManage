import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';
import { Form, Head } from '@inertiajs/react';

export default function ConfirmPassword() {
    return (
        <AuthLayout
            title="Confirm your password"
            description="This is a secure area of the application. Please confirm your password before continuing."
        >
            <Head title="Confirm password" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                disableWhileProcessing
                className="space-y-6 inert:pointer-events-none inert:opacity-60 inert:grayscale-100"
            >
                {({ processing, errors }) => (
                    <>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                autoComplete="current-password"
                                placeholder="Password"
                                required
                                aria-required
                                aria-invalid={!!errors.password}
                            />

                            <InputError message={errors.password} />
                        </Field>

                        <div className="flex items-center">
                            <Button className="w-full" disabled={processing} data-test="confirm-password-button">
                                {processing && <Spinner />}
                                Confirm password
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
