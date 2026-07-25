import { useMemo, useState } from "react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
  type Updater,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ArrowDownRight,
  ArrowUpDown,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  ListChecks,
  Minus,
  Search,
  Settings,
  Sparkles,
  Users,
} from "lucide-react"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const dashboardOverviewSchema = z.object({
  metrics: z.array(z.object({
    label: z.string(),
    value: z.string(),
    delta: z.string(),
  })).min(1),
  chart: z.array(z.object({
    label: z.string(),
    value: z.number(),
  })).min(2).optional(),
  rows: z.array(z.object({
    name: z.string(),
    owner: z.string(),
    status: z.string(),
    value: z.string(),
  })),
})

export type DashboardOverviewData = z.infer<typeof dashboardOverviewSchema>
export type DashboardOverviewState = "success" | "loading" | "empty" | "contract-error"
export type DashboardTableQuery = {
  search: string
  sorting: SortingState
  pagination: PaginationState
}
type DashboardOverviewBaseProps = {
  data?: DashboardOverviewData
  state?: DashboardOverviewState
}
export type DashboardOverviewProps = DashboardOverviewBaseProps & (
  | { tableQuery?: undefined; rowCount?: undefined; onTableQueryChange?: undefined }
  | { tableQuery: DashboardTableQuery; rowCount: number; onTableQueryChange: (query: DashboardTableQuery) => void }
)

const fixture: DashboardOverviewData = {
  metrics: [
    { label: "Revenue", value: "$842k", delta: "+12.4%" },
    { label: "Target", value: "86.2%", delta: "+4.1%" },
    { label: "Pipeline", value: "$1.8m", delta: "+9.8%" },
  ],
  chart: [
    { label: "W1", value: 31 },
    { label: "W2", value: 43 },
    { label: "W3", value: 38 },
    { label: "W4", value: 57 },
    { label: "W5", value: 52 },
    { label: "W6", value: 68 },
    { label: "W7", value: 63 },
    { label: "W8", value: 78 },
    { label: "W9", value: 73 },
    { label: "W10", value: 88 },
  ],
  rows: [
    { name: "Northwind", owner: "Maya", status: "Qualified", value: "$84k" },
    { name: "Acme Labs", owner: "Theo", status: "Proposal", value: "$67k" },
    { name: "Sora Retail", owner: "Iris", status: "Negotiation", value: "$52k" },
  ],
}

const chartConfig = {
  value: { label: "Value", color: "var(--chart-1)" },
} satisfies ChartConfig

const navigation = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", icon: LayoutDashboard, active: true },
      { label: "Analytics", icon: BarChart3, active: false },
      { label: "Reports", icon: FileText, active: false },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Records", icon: ListChecks, active: false },
      { label: "Automations", icon: Bot, active: false },
      { label: "Team", icon: Users, active: false },
    ],
  },
]

function Delta({ value }: { value: string }) {
  const direction = /^[\s]*[-−]/.test(value) ? "down" : /^[\s]*\+/.test(value) ? "up" : "neutral"
  const Icon = direction === "down" ? ArrowDownRight : direction === "up" ? ArrowUpRight : Minus
  const color = direction === "down" ? "text-red-600" : direction === "up" ? "text-emerald-600" : "text-muted-foreground"
  return <div className={`mt-1 flex items-center text-xs ${color}`}><Icon className="mr-1 size-3" />{value}</div>
}

const row = createColumnHelper<DashboardOverviewData["rows"][number]>()
const columns = [
  row.accessor("name", {
    header: ({ column }) => <Button className="-ml-3" variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Name<ArrowUpDown className="ml-2 size-3" /></Button>,
  }),
  row.accessor("owner", {
    header: ({ column }) => <Button className="-ml-3" variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Owner<ArrowUpDown className="ml-2 size-3" /></Button>,
  }),
  row.accessor("status", {
    header: "Status",
    cell: (info) => <Badge variant="secondary">{info.getValue()}</Badge>,
  }),
  row.accessor("value", { header: "Value" }),
]

export function DashboardOverview01({
  data = fixture,
  state = "success",
  tableQuery,
  rowCount,
  onTableQueryChange,
}: DashboardOverviewProps) {
  const parsed = dashboardOverviewSchema.safeParse(data)
  const rows = parsed.success ? parsed.data.rows : []
  const metrics = useMemo(() => parsed.success ? parsed.data.metrics : [], [parsed])
  const chart = parsed.success ? parsed.data.chart ?? [] : []
  const [internalTableQuery, setInternalTableQuery] = useState<DashboardTableQuery>({
    search: "",
    sorting: [],
    pagination: { pageIndex: 0, pageSize: 10 },
  })
  const activeTableQuery = tableQuery ?? internalTableQuery
  const serverControlled = tableQuery !== undefined
  const updateTableQuery = (next: DashboardTableQuery) => {
    if (tableQuery === undefined) setInternalTableQuery(next)
    onTableQueryChange?.(next)
  }
  const resolve = <T,>(updater: Updater<T>, current: T) => typeof updater === "function" ? (updater as (value: T) => T)(current) : updater
  const table = useReactTable({
    data: rows,
    columns,
    state: {
      globalFilter: activeTableQuery.search,
      sorting: activeTableQuery.sorting,
      pagination: activeTableQuery.pagination,
    },
    onGlobalFilterChange: (updater) => updateTableQuery({ ...activeTableQuery, search: resolve(updater, activeTableQuery.search), pagination: { ...activeTableQuery.pagination, pageIndex: 0 } }),
    onSortingChange: (updater) => updateTableQuery({ ...activeTableQuery, sorting: resolve(updater, activeTableQuery.sorting), pagination: { ...activeTableQuery.pagination, pageIndex: 0 } }),
    onPaginationChange: (updater) => updateTableQuery({ ...activeTableQuery, pagination: resolve(updater, activeTableQuery.pagination) }),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: serverControlled ? undefined : getFilteredRowModel(),
    getSortedRowModel: serverControlled ? undefined : getSortedRowModel(),
    getPaginationRowModel: serverControlled ? undefined : getPaginationRowModel(),
    manualFiltering: serverControlled,
    manualSorting: serverControlled,
    manualPagination: serverControlled,
    rowCount: serverControlled ? rowCount : undefined,
  })

  const content = state === "loading" ? (
    <div className="grid gap-4 lg:grid-cols-3" role="status" aria-label="Loading dashboard data">
      {[0, 1, 2, 3, 4, 5].map((item) => <Skeleton className={item > 2 ? "h-72 lg:col-span-3" : "h-36"} key={item} />)}
    </div>
  ) : state === "contract-error" || !parsed.success ? (
    <Card className="border-destructive" role="alert">
      <CardHeader><CardTitle>Contract mismatch</CardTitle></CardHeader>
      <CardContent className="text-sm text-muted-foreground">Check the data adapter against dashboardOverviewSchema.</CardContent>
    </Card>
  ) : state === "empty" ? (
    <Card role="status"><CardContent className="flex min-h-72 items-center justify-center text-sm text-muted-foreground">No records in this range.</CardContent></Card>
  ) : (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-3">
        {metrics.slice(0, 3).map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-semibold">{metric.value}</div><Delta value={metric.delta} /></CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(18rem,.5fr)]">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div><CardTitle>Momentum</CardTitle><CardDescription>Performance across the selected period.</CardDescription></div>
            {metrics[2] ? <div className="text-right"><p className="text-xs text-muted-foreground">{metrics[2].label}</p><p className="text-lg font-semibold">{metrics[2].value}</p></div> : null}
          </CardHeader>
          <CardContent>
            {chart.length > 1 ? (
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <AreaChart accessibilityLayer data={chart}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                  <Area dataKey="value" type="natural" fill="var(--color-value)" fillOpacity={0.18} stroke="var(--color-value)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            ) : <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">No trend data for this range.</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Team members</CardTitle><CardDescription>Owners in this priority view.</CardDescription></CardHeader>
          <CardContent className="grid gap-3">
            {rows.slice(0, 3).map((item) => (
              <div className="flex items-center gap-3" key={`${item.owner}-${item.name}`}>
                <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">{item.owner.slice(0, 2).toUpperCase()}</div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.owner}</p><p className="truncate text-xs text-muted-foreground">{item.name}</p></div>
                <Badge variant="outline">{item.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Priority accounts</CardTitle><CardDescription>Server-controlled records for the active filters.</CardDescription></CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Input className="max-w-sm" value={activeTableQuery.search} onChange={(event) => table.setGlobalFilter(event.target.value)} placeholder="Filter accounts..." aria-label="Filter accounts" />
            <p className="text-xs text-muted-foreground">{rowCount ?? table.getFilteredRowModel().rows.length} records</p>
          </div>
          <Table>
            <TableHeader>{table.getHeaderGroups().map((group) => <TableRow key={group.id}>{group.headers.map((header) => {
              const sorted = header.column.getIsSorted()
              return <TableHead aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : header.column.getCanSort() ? "none" : undefined} key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
            })}</TableRow>)}</TableHeader>
            <TableBody>{table.getRowModel().rows.length > 0 ? table.getRowModel().rows.map((tableRow) => <TableRow key={tableRow.id}>{tableRow.getVisibleCells().map((cell) => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}</TableRow>) : <TableRow><TableCell className="h-24 text-center text-muted-foreground" colSpan={columns.length}>No records for the current query.</TableCell></TableRow>}</TableBody>
          </Table>
          <div className="flex items-center justify-end gap-2">
            <span className="mr-2 text-xs text-muted-foreground">Page {activeTableQuery.pagination.pageIndex + 1}</span>
            <Button variant="outline" size="icon" aria-label="Previous page" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft className="size-4" /></Button>
            <Button variant="outline" size="icon" aria-label="Next page" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight className="size-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#"><span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="size-4" /></span><span className="font-semibold">Shadcn Agent</span></a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {navigation.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild isActive={item.active}>
                        <a href="#"><item.icon /><span>{item.label}</span></a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu><SidebarMenuItem><SidebarMenuButton asChild><a href="#"><Settings /><span>Settings</span></a></SidebarMenuButton></SidebarMenuItem></SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <div className="relative max-w-sm flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder="Search workspace..." /></div>
          <Button variant="ghost" size="icon" aria-label="Notifications"><Bell className="size-4" /></Button>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-sm text-muted-foreground">Overview</p><h1 className="text-2xl font-semibold tracking-tight">Sales command center</h1></div>
            <div className="flex gap-2"><Button variant="outline">Last 12 weeks</Button><Button>Export</Button></div>
          </div>
          {content}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
