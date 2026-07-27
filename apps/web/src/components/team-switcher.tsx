import { Link } from "@tanstack/react-router"
import { LogoMark } from "@/components/logo"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import type { Locale } from "@/i18n"

export function TeamSwitcher({ locale }: { locale: Locale }) {
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild tooltip="shadcnagent">
          <Link
            to="/dashboard/$dashboardId"
            params={{ dashboardId: "default" }}
            onClick={() => isMobile && setOpenMobile(false)}
          >
            <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <LogoMark compact />
            </span>
            <span className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">shadcnagent</span>
              <span className="truncate text-xs">{locale === "zh" ? "Dashboard 配方" : "Dashboard Recipes"}</span>
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
