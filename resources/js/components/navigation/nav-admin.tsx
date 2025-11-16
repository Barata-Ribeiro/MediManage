import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import permissions from '@/routes/admin/permissions';
import roles from '@/routes/admin/roles';
import users from '@/routes/admin/users';
import articles from '@/routes/articles';
import categories from '@/routes/categories';
import employee_info from '@/routes/employee_info';
import notices from '@/routes/notices';
import { type NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    ChartBarStackedIcon,
    FlagIcon,
    IdCardLanyardIcon,
    NewspaperIcon,
    NotebookIcon,
    ShieldUserIcon,
    UsersIcon,
} from 'lucide-react';

export function NavAdmin() {
    const { props, url } = usePage<SharedData>();

    const auth = props.auth;

    const isSuperAdmin = auth.roles.includes('Super Admin');
    if (!isSuperAdmin) return null;

    const items: NavItem[] = [
        {
            title: 'Roles',
            href: roles.index(),
            icon: NotebookIcon,
        },
        {
            title: 'Permissions',
            href: permissions.index(),
            icon: ShieldUserIcon,
        },
        {
            title: 'Users',
            href: users.index(),
            icon: UsersIcon,
        },
    ];

    const articleItems: NavItem[] = [
        {
            title: 'Articles',
            href: articles.index(),
            icon: NewspaperIcon,
        },
        {
            title: 'Categories',
            href: categories.index(),
            icon: ChartBarStackedIcon,
        },
    ];

    const otherItems: NavItem[] = [
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
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={url.startsWith(typeof item.href === 'string' ? item.href : item.href.url)}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
            <SidebarGroupLabel>Articles</SidebarGroupLabel>
            <SidebarMenu>
                {articleItems.map((item) => {
                    const isActive = url.endsWith(typeof item.href === 'string' ? item.href : item.href.url);

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
            <SidebarGroupLabel>Other</SidebarGroupLabel>
            <SidebarMenu>
                {otherItems.map((item) => {
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
