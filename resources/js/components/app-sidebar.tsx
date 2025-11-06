import AppLogo from '@/components/app-logo';
import { NavAdmin } from '@/components/navigation/nav-admin';
import NavAttendant from '@/components/navigation/nav-attendant';
import { NavDoctor } from '@/components/navigation/nav-doctor';
import { NavFooter } from '@/components/navigation/nav-footer';
import { NavMain } from '@/components/navigation/nav-main';
import NavManager from '@/components/navigation/nav-manager';
import { NavPatient } from '@/components/navigation/nav-patient';
import { NavUser } from '@/components/navigation/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BriefcaseBusinessIcon, FolderIcon, LayoutGrid } from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/Barata-Ribeiro/MediManage',
        icon: FolderIcon,
    },
    {
        title: 'Developed By',
        href: 'https://barataribeiro.com/',
        icon: BriefcaseBusinessIcon,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavPatient />
                <NavAttendant />
                <NavDoctor />
                <NavManager />
                <NavAdmin />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
