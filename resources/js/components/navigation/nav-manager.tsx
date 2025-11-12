import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import employee_info from '@/routes/employee_info';
import invoices from '@/routes/invoices';
import notices from '@/routes/notices';
import { type NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { FlagIcon, IdCardLanyardIcon, ScrollTextIcon } from 'lucide-react';

export default function NavManager() {
    const { props, url } = usePage<SharedData>();
    const auth = props.auth;

    const isManager = auth.roles.includes('Manager');
    if (!isManager || !auth.user.employee_info_id) return null;

    const managerItems: NavItem[] = [
        {
            title: 'Invoices',
            href: invoices.index().url,
            icon: ScrollTextIcon,
        },
        {
            title: 'Employees',
            href: employee_info.index().url,
            icon: IdCardLanyardIcon,
        },
        {
            title: 'Notices',
            href: notices.index().url,
            icon: FlagIcon,
        },
    ];

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Manager</SidebarGroupLabel>
            <SidebarMenu>
                {managerItems.map((item) => {
                    const urlWithoutQuery = url.split('?')[0];
                    const endingPath = typeof item.href === 'string' ? item.href : item.href.url;
                    const isActive = urlWithoutQuery.endsWith(endingPath);

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={isActive} tooltip={{ children: item.title }}>
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
