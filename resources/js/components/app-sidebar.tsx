import { NavFooter } from "@/components/nav-footer"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { dashboard } from "@/routes"
import type { NavItem } from "@/types"
import { Link } from "@inertiajs/react"
import { LayoutDashboard, Users, GraduationCap } from "lucide-react"
import AppLogo from "./app-logo"

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: dashboard(),
    icon: LayoutDashboard,
  },
  {
    title: "Trainees",
    href: dashboard(),
    icon: Users,
  },
  {
    title: "Program List",
    href: dashboard(),
    icon: GraduationCap,
  },
]

const footerNavItems: NavItem[] = [
  // {
  //     title: 'Repository',
  //     href: 'https://github.com/laravel/react-starter-kit',
  //     icon: Folder,
  // },
  // {
  //     title: 'Documentation',
  //     href: 'https://laravel.com/docs/starter-kits#react',
  //     icon: BookOpen,
  // },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r border-sidebar-border/50">
      <SidebarHeader className="border-b border-sidebar-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent/50 transition-colors">
              <Link href={dashboard()} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 mt-auto">
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
