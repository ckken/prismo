import { mkdir } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { dashboardOverviewRecipe } from "../packages/dashboard-agent/src/catalog.ts"

const root = resolve(import.meta.dir, "..")
const sourcePath = resolve(root, "packages/registry/src/dashboard-overview-01.tsx")
const outputDir = resolve(root, "apps/web/public/r")
const schemaSourceDir = resolve(root, "packages/dashboard-agent/schemas")
const schemaOutputDir = resolve(root, "apps/web/public/schemas")
const source = await Bun.file(sourcePath).text()
const homepage = process.env.PUBLIC_REPOSITORY_URL ?? "https://github.com/ckken/prismo"

const item = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: dashboardOverviewRecipe.id,
  title: dashboardOverviewRecipe.title,
  description: dashboardOverviewRecipe.description,
  type: "registry:block",
  dependencies: [...dashboardOverviewRecipe.dependencies],
  registryDependencies: [...dashboardOverviewRecipe.registryDependencies],
  files: [
    {
      path: "components/dashboard-overview-01.tsx",
      type: "registry:component",
      target: "components/dashboard-overview-01.tsx",
      content: source,
    },
  ],
  meta: {
    project: "prismo",
    status: dashboardOverviewRecipe.status.toLowerCase(),
    tableLevel: dashboardOverviewRecipe.tableLevel,
    states: [...dashboardOverviewRecipe.states],
    capabilities: [...dashboardOverviewRecipe.capabilities],
  },
}

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "prismo",
  homepage,
  items: [item],
}

await Promise.all([
  mkdir(outputDir, { recursive: true }),
  mkdir(schemaOutputDir, { recursive: true }),
])
await Promise.all([
  Bun.write(resolve(outputDir, `${item.name}.json`), `${JSON.stringify(item, null, 2)}\n`),
  Bun.write(resolve(outputDir, "registry.json"), `${JSON.stringify(registry, null, 2)}\n`),
  Bun.write(resolve(schemaOutputDir, "dashboard-spec.v1.schema.json"), Bun.file(resolve(schemaSourceDir, "dashboard-spec.v1.schema.json"))),
  Bun.write(resolve(schemaOutputDir, "dashboard-plan.v1.schema.json"), Bun.file(resolve(schemaSourceDir, "dashboard-plan.v1.schema.json"))),
])

console.log(`Built ${item.name} -> ${dirname(resolve(outputDir, `${item.name}.json`))}`)
