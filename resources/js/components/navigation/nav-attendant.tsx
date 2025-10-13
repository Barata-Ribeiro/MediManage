import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { createPartial } from '@/routes/patient_info';
import { type NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { UserPlusIcon } from 'lucide-react';

export default function NavAttendant() {
    const { props, url } = usePage<SharedData>();
    const auth = props.auth;

    const isAttendant = auth.roles.includes('Attendant');
    if (!isAttendant || !auth.user.employee_info_id) return null;

    const attendantItems: NavItem[] = [
        {
            title: 'New Patient',
            href: createPartial().url,
            icon: UserPlusIcon,
        },
    ];

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Attendant</SidebarGroupLabel>
            <SidebarMenu>
                {attendantItems.map((item) => {
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
        </SidebarGroup>
    );
}
