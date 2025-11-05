import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link } from '@inertiajs/react';
import { Activity, Fragment } from 'react';

export function Breadcrumbs({
    breadcrumbs,
}: Readonly<{
    breadcrumbs: BreadcrumbItemType[];
}>) {
    return (
        <Activity mode={breadcrumbs.length > 0 ? 'visible' : 'hidden'}>
            <Breadcrumb>
                <BreadcrumbList>
                    {breadcrumbs.map((item, index) => {
                        const isLast = index === breadcrumbs.length - 1;

                        return (
                            <Fragment key={index}>
                                <BreadcrumbItem>
                                    {isLast ? (
                                        <BreadcrumbPage>{item.title}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link href={item.href}>{item.title}</Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>

                                <Activity mode={isLast ? 'hidden' : 'visible'}>
                                    <BreadcrumbSeparator />
                                </Activity>
                            </Fragment>
                        );
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </Activity>
    );
}
