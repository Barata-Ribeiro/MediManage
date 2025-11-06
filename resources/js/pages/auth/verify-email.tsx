// Components
import EmailVerificationNotificationController from '@/actions/App/Http/Controllers/Auth/EmailVerificationNotificationController';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { Activity } from 'react';

export default function VerifyEmail({ status }: Readonly<{ status?: string }>) {
    return (
        <AuthLayout
            title="Verify email"
            description="Please verify your email address by clicking on the link we just emailed to you."
        >
            <Head title="Email verification" />

            <Activity mode={status === 'verification-link-sent' ? 'visible' : 'hidden'}>
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address you provided during registration.
                </div>
            </Activity>

            <Form
                {...EmailVerificationNotificationController.store.form()}
                disableWhileProcessing
                className="space-y-6 text-center inert:pointer-events-none inert:opacity-50 inert:grayscale-100"
            >
                {({ processing }) => (
                    <>
                        <Button variant="secondary">
                            <Activity mode={processing ? 'visible' : 'hidden'}>
                                <LoaderCircle className="size-4 animate-spin" />
                            </Activity>
                            Resend verification email
                        </Button>

                        <TextLink href={logout()} className="mx-auto block text-sm">
                            Log out
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
