import { mkdir } from "node:fs/promises"
import { dirname, resolve } from "node:path"

const root = resolve(import.meta.dir, "..")
const sourcePath = resolve(root, "packages/registry/src/dashboard-overview-01.tsx")
const outputDir = resolve(root, "apps/web/public/r")
const source = await Bun.file(sourcePath).text()
const homepage = process.env.PUBLIC_REPOSITORY_URL ?? "https://github.com"

const item = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "dashboard-overview-01",
  title: "Dashboard Overview 01",
  description: "A contract-aware overview with metrics, a managed table, and four explicit data states.",
  type: "registry:block",
  dependencies: ["@tanstack/react-table", "lucide-react", "zod"],
  registryDependencies: ["badge", "card", "skeleton", "table"],
  files: [
    {
      path: "components/dashboard-overview-01.tsx",
      type: "registry:component",
      target: "components/dashboard-overview-01.tsx",
      content: source,
    },
  ],
  meta: {
    project: "Shadcn Agent Kit",
    status: "available",
    tableLevel: "L0",
    states: ["success", "loading", "empty", "contract-error"],
  },
}

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "shadcn-agent-kit",
  homepage,
  items: [item],
}

await mkdir(outputDir, { recursive: true })
await Promise.all([
  Bun.write(resolve(outputDir, `${item.name}.json`), `${JSON.stringify(item, null, 2)}\n`),
  Bun.write(resolve(outputDir, "registry.json"), `${JSON.stringify(registry, null, 2)}\n`),
])

console.log(`Built ${item.name} -> ${dirname(resolve(outputDir, `${item.name}.json`))}`)
