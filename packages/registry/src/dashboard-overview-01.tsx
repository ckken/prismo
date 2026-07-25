import { useMemo } from "react"
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const dashboardOverviewSchema = z.object({
  metrics: z.array(z.object({
    label: z.string(),
    value: z.string(),
    delta: z.string(),
  })).min(1),
  rows: z.array(z.object({
    name: z.string(),
    owner: z.string(),
    status: z.string(),
    value: z.string(),
  })),
})

export type DashboardOverviewData = z.infer<typeof dashboardOverviewSchema>
export type DashboardOverviewState = "success" | "loading" | "empty" | "contract-error"

function Delta({ value }: { value: string }) {
  const direction = /^[\s]*[-−]/.test(value) ? "down" : /^[\s]*\+/.test(value) ? "up" : "neutral"
  const Icon = direction === "down" ? ArrowDownRight : direction === "up" ? ArrowUpRight : Minus
  const color = direction === "down" ? "text-red-600" : direction === "up" ? "text-emerald-600" : "text-muted-foreground"
  return <div className={`mt-1 flex items-center text-xs ${color}`}><Icon className="mr-1 size-3" />{value}</div>
}

const row = createColumnHelper<DashboardOverviewData["rows"][number]>()
const columns = [
  row.accessor("name", { header: "Name" }),
  row.accessor("owner", { header: "Owner" }),
  row.accessor("status", {
    header: "Status",
    cell: (info) => <Badge variant="secondary">{info.getValue()}</Badge>,
  }),
  row.accessor("value", { header: "Value" }),
]

const fixture: DashboardOverviewData = {
  metrics: [
    { label: "Revenue", value: "$842k", delta: "+12.4%" },
    { label: "Target", value: "86.2%", delta: "+4.1%" },
    { label: "Pipeline", value: "$1.8m", delta: "+9.8%" },
  ],
  rows: [
    { name: "Northwind", owner: "Maya", status: "Qualified", value: "$84k" },
    { name: "Acme Labs", owner: "Theo", status: "Proposal", value: "$67k" },
    { name: "Sora Retail", owner: "Iris", status: "Negotiation", value: "$52k" },
  ],
}

export function DashboardOverview01({
  data = fixture,
  state = "success",
}: {
  data?: DashboardOverviewData
  state?: DashboardOverviewState
}) {
  const parsed = dashboardOverviewSchema.safeParse(data)
  const rows = parsed.success ? parsed.data.rows : []
  const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() })
  const metrics = useMemo(() => parsed.success ? parsed.data.metrics : [], [parsed])

  if (state === "loading") {
    return <div className="grid gap-4 md:grid-cols-3">{[0, 1, 2].map((item) => <Skeleton className="h-28" key={item} />)}</div>
  }

  if (state === "contract-error" || !parsed.success) {
    return <Card className="border-destructive"><CardHeader><CardTitle>Contract mismatch</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Check the data adapter against dashboardOverviewSchema.</CardContent></Card>
  }

  if (state === "empty" || rows.length === 0) {
    return <Card><CardContent className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">No records in this range.</CardContent></Card>
  }

  return (
    <section className="grid gap-4" aria-label="Dashboard overview">
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-semibold">{metric.value}</div><Delta value={metric.delta} /></CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Priority accounts</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>{table.getHeaderGroups().map((group) => <TableRow key={group.id}>{group.headers.map((header) => <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>)}</TableRow>)}</TableHeader>
            <TableBody>{table.getRowModel().rows.map((tableRow) => <TableRow key={tableRow.id}>{tableRow.getVisibleCells().map((cell) => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}</TableRow>)}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}
