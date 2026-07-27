"use client"

import {
  ChevronsUpDown,
  Github,
  Languages,
  Moon,
  ShieldCheck,
  Sun,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import type { Locale } from "@/i18n"
import type { Theme } from "@/preferences"

export function NavUser({
  locale,
  theme,
  repositoryUrl,
  onLocaleChange,
  onThemeChange,
}: {
  locale: Locale
  theme: Theme
  repositoryUrl: string
  onLocaleChange: () => void
  onThemeChange: () => void
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">SA</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">shadcnagent</span>
                <span className="truncate text-xs">1 Available · 5 Candidate</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="flex items-center gap-2 font-normal">
              <ShieldCheck className="size-4" />
              <span>{locale === "zh" ? "从需求到 Proof" : "From request to proof"}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onLocaleChange}>
              <Languages />
              {locale === "zh" ? "Switch to English" : "切换为中文"}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onThemeChange}>
              {theme === "light" ? <Moon /> : <Sun />}
              {locale === "zh" ? "切换主题" : "Toggle theme"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href={repositoryUrl} target="_blank" rel="noreferrer">
                <Github />
                GitHub
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
