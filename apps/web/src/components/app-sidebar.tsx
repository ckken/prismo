import * as React from "react"
import {
  Activity,
  BarChart3,
  Boxes,
  CircleDollarSign,
  Github,
  LayoutDashboard,
  ShoppingBag,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  dashboards,
  localize,
  siteText,
  type DashboardId,
} from "@/dashboard-site-data"
import type { Locale } from "@/i18n"
import type { Theme } from "@/preferences"

const dashboardIcons: Record<DashboardId, LucideIcon> = {
  default: LayoutDashboard,
  sales: BarChart3,
  commerce: ShoppingBag,
  "agent-ops": Activity,
  crm: Users,
  finance: CircleDollarSign,
}

export function AppSidebar({
  locale,
  theme,
  onLocaleChange,
  onThemeChange,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  locale: Locale
  theme: Theme
  onLocaleChange: () => void
  onThemeChange: () => void
}) {
  const t = siteText[locale]
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <TeamSwitcher locale={locale} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          label={t.nav.dashboards}
          items={dashboards.map((dashboard) => ({
            title: localize(dashboard.title, locale),
            id: dashboard.id,
            icon: dashboardIcons[dashboard.id],
            status: dashboard.status,
          }))}
        />
        <NavProjects
          label={t.nav.agentKit}
          items={[
            { name: t.nav.catalog, to: "/catalog", icon: Boxes },
            { name: t.nav.workflow, to: "/workflow", icon: Workflow },
          ]}
          external={{ name: t.nav.github, href: __PUBLIC_REPOSITORY_URL__, icon: Github }}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          locale={locale}
          theme={theme}
          repositoryUrl={__PUBLIC_REPOSITORY_URL__}
          onLocaleChange={onLocaleChange}
          onThemeChange={onThemeChange}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
