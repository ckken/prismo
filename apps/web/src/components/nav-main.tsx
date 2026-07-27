"use client"

import { Link, useMatchRoute } from "@tanstack/react-router"
import type { LucideIcon } from "lucide-react"
import type { DashboardId, RecipeStatus } from "@/dashboard-site-data"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  label,
  items,
}: {
  label: string
  items: Array<{
    title: string
    id: DashboardId
    icon: LucideIcon
    status: RecipeStatus
  }>
}) {
  const matchRoute = useMatchRoute()
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const active = Boolean(matchRoute({
            to: "/dashboard/$dashboardId",
            params: { dashboardId: item.id },
          }))
          return (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild isActive={active} tooltip={item.title} className="pr-8">
                <Link
                  to="/dashboard/$dashboardId"
                  params={{ dashboardId: item.id }}
                  onClick={() => isMobile && setOpenMobile(false)}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuBadge
                aria-label={item.status === "available" ? "Available" : "Candidate"}
                className={item.status === "available" ? "text-emerald-700 dark:text-emerald-400" : ""}
              >
                {item.status === "available" ? "A" : "C"}
              </SidebarMenuBadge>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
