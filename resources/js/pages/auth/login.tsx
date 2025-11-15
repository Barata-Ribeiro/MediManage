import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { Activity } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({ status, canResetPassword, canRegister }: Readonly<LoginProps>) {
    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6 inert:pointer-events-none inert:opacity-60 inert:grayscale-100"
                disableWhileProcessing
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <Field>
                                <FieldLabel htmlFor="email">Email address</FieldLabel>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    required
                                    aria-required
                                    aria-invalid={!!errors.email}
                                />
                                <InputError message={errors.email} />
                            </Field>

                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>

                                    <Activity mode={canResetPassword ? 'visible' : 'hidden'}>
                                        <TextLink href={request()} className="ml-auto text-sm" tabIndex={5}>
                                            Forgot password?
                                        </TextLink>
                                    </Activity>
                                </div>

                                <Input
                                    type="password"
                                    id="password"
                                    name="password"
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    required
                                    aria-required
                                    aria-invalid={!!errors.password}
                                />
                                <InputError message={errors.password} />
                            </Field>

                            <div className="flex items-center space-x-3">
                                <Checkbox id="remember" name="remember" tabIndex={3} />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </div>

                        <Activity mode={canRegister ? 'visible' : 'hidden'}>
                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <TextLink href={register()} tabIndex={5}>
                                    Sign up
                                </TextLink>
                            </div>
                        </Activity>
                    </>
                )}
            </Form>

            {status && <div className="mt-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
