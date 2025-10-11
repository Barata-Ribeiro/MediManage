import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { logout } from '@/routes';
import { destroy, index as listSessions } from '@/routes/sessions';
import type { BreadcrumbItem } from '@/types';
import { Session } from '@/types/application/session';
import { Head, Link, router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';

interface SessionsProps {
    sessions: Session[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sessions',
        href: listSessions().url,
    },
];

export default function Sessions({ sessions }: Readonly<SessionsProps>) {
    const handleLogout = () => router.flushAll();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Current Sessions" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Current Sessions"
                        description="Manage and log out your active sessions on other browsers and devices."
                    />

                    <div className="space-y-4">
                        {sessions.map((session, idx) => {
                            const key = `session-${session.id}-${idx}`;

                            return (
                                <Item key={key} variant="outline" className="flex flex-wrap">
                                    <ItemContent>
                                        <ItemTitle className="font-semibold">{session.user_agent}</ItemTitle>
                                        <ItemDescription className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                            <span className="truncate font-mono text-xs text-gray-500">
                                                {session.ip_address}
                                            </span>

                                            <span className="truncate">{session.last_activity}</span>

                                            <span className="ml-1 text-xs text-gray-400">
                                                ({session.last_activity_label})
                                            </span>
                                        </ItemDescription>
                                    </ItemContent>

                                    <ItemActions>
                                        <Button variant="destructive" size="sm" asChild>
                                            {session.is_current_device ? (
                                                <Link
                                                    className="block w-full"
                                                    href={logout()}
                                                    as="button"
                                                    onClick={handleLogout}
                                                >
                                                    <LogOut aria-hidden className="mr-2" />
                                                    Log out
                                                </Link>
                                            ) : (
                                                <Link
                                                    className="block w-full"
                                                    href={destroy(session.id)}
                                                    method="delete"
                                                    as="button"
                                                >
                                                    Delete
                                                </Link>
                                            )}
                                        </Button>
                                    </ItemActions>
                                </Item>
                            );
                        })}
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
