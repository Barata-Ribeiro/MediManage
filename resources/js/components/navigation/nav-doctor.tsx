import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import medicalRecords from '@/routes/medicalRecords';
import prescriptions from '@/routes/prescriptions';
import { type NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ClipboardListIcon, ClipboardPlusIcon, PillIcon } from 'lucide-react';

export function NavDoctor() {
    const { props, url } = usePage<SharedData>();

    const auth = props.auth;

    const isDoctor = auth.roles.includes('Doctor');
    if (!isDoctor || !auth.user.employee_info_id) return null;

    const items: NavItem[] = [
        {
            title: 'Prescriptions',
            href: prescriptions.index(auth.user.employee_info_id),
            icon: PillIcon,
        },
        { title: 'Medical Records', href: medicalRecords.index(), icon: ClipboardListIcon },
        { title: 'Initiate Record', href: medicalRecords.create(), icon: ClipboardPlusIcon },
    ];

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Doctor</SidebarGroupLabel>
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
        </SidebarGroup>
    );
}
