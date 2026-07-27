import { Link, useMatchRoute } from "@tanstack/react-router"
import type { LucideIcon } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

type InternalItem = {
  name: string
  to: "/catalog" | "/workflow"
  icon: LucideIcon
}

type ExternalItem = {
  name: string
  href: string
  icon: LucideIcon
}

export function NavProjects({
  label,
  items,
  external,
}: {
  label: string
  items: InternalItem[]
  external: ExternalItem
}) {
  const matchRoute = useMatchRoute()
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.to}>
            <SidebarMenuButton asChild isActive={Boolean(matchRoute({ to: item.to }))} tooltip={item.name}>
              <Link to={item.to} onClick={() => isMobile && setOpenMobile(false)}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip={external.name}>
            <a href={external.href} target="_blank" rel="noreferrer">
              <external.icon />
              <span>{external.name}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
