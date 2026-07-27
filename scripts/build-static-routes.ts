import { copyFile, mkdir } from "node:fs/promises"
import { dirname, resolve } from "node:path"

const root = resolve(import.meta.dir, "..")
const dist = resolve(root, "apps/web/dist")
const entry = resolve(dist, "index.html")
const routes = [
  "dashboard/default",
  "dashboard/sales",
  "dashboard/commerce",
  "dashboard/agent-ops",
  "dashboard/crm",
  "dashboard/finance",
  "catalog",
  "workflow",
]

await Promise.all(routes.map(async (route) => {
  const output = resolve(dist, route, "index.html")
  await mkdir(dirname(output), { recursive: true })
  await copyFile(entry, output)
}))

await copyFile(entry, resolve(dist, "404.html"))

console.log(`Built ${routes.length} static route entries and 404 fallback`)
