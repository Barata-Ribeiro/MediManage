import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Layout from '@/layouts/app-layout';
import permissions from '@/routes/admin/permissions';
import roles from '@/routes/admin/roles';
import { BreadcrumbItem } from '@/types';
import { Permission } from '@/types/admin/permissions';
import { Head, Link } from '@inertiajs/react';

export default function Index({ permission }: Readonly<{ permission: Permission }>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Permissions',
            href: permissions.index().url,
        },
        {
            title: permission.name,
            href: permissions.show(permission.id).url,
        },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`Permission: ${permission.name}`} />

            <div className="px-4 py-6">
                <Heading
                    title={`Permission: ${permission.name}`}
                    description="Detailed information about this permission."
                />

                <div className="mt-6 grid grid-cols-1 gap-6 rounded-lg border border-border p-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
                        <div className="text-lg font-semibold">{permission.title}</div>

                        <h3 className="mt-4 text-sm font-medium text-muted-foreground">Name</h3>
                        <div className="text-lg font-semibold">{permission.name}</div>

                        <h3 className="mt-4 text-sm font-medium text-muted-foreground">Guard</h3>
                        <div className="text-lg">{permission.guard_name ?? '—'}</div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                        <div className="text-lg">{new Date(permission.created_at).toLocaleString()}</div>

                        <h3 className="mt-4 text-sm font-medium text-muted-foreground">Updated</h3>
                        <div className="text-lg">{new Date(permission.updated_at).toLocaleString()}</div>

                        <h3 className="mt-4 text-sm font-medium text-muted-foreground">Assigned Roles</h3>
                        <div className="flex flex-wrap gap-2">
                            {permission.roles && permission.roles.length > 0 ? (
                                permission.roles.map((r) => (
                                    <Link key={r.id} href={roles.edit(r.id).url} className="no-underline">
                                        <Badge>{r.name}</Badge>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-sm text-muted-foreground">No roles assigned</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-4 inline-flex items-center gap-x-2">
                    <Button variant="outline" asChild>
                        <Link href={permissions.index()} prefetch>
                            Go Back
                        </Link>
                    </Button>

                    <Button>
                        <Link href={permissions.edit(permission.id)} prefetch>
                            Edit Permission
                        </Link>
                    </Button>
                </div>
            </div>
        </Layout>
    );
}
