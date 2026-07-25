import { resolve } from "node:path"

const target = resolve(process.argv[2] ?? process.cwd())
const requestedComponent = process.argv[3]
const defaultComponents = [
  "src/components/dashboard-overview-01.tsx",
  "components/dashboard-overview-01.tsx",
]
const component = requestedComponent
  ?? await Promise.all(defaultComponents.map(async (path) => [path, await Bun.file(resolve(target, path)).exists()] as const))
    .then((candidates) => candidates.find(([, exists]) => exists)?.[0] ?? defaultComponents[0])
const componentPath = resolve(target, component)
const packagePath = resolve(target, "package.json")
const componentsPath = resolve(target, "components.json")

const checks = await Promise.all([
  ["package", packagePath, await Bun.file(packagePath).exists()],
  ["shadcn-config", componentsPath, await Bun.file(componentsPath).exists()],
  ["installed-source", componentPath, await Bun.file(componentPath).exists()],
] as const)

const failed = checks.filter(([, , passed]) => !passed)

console.log(JSON.stringify({
  target,
  checks: checks.map(([name, path, passed]) => ({ name, path, status: passed ? "passed" : "failed" })),
  unverified: ["target typecheck", "target tests", "production build", "four UI states", "responsive widths", "accessibility basics"],
  status: failed.length === 0 ? "structural-checks-passed" : "failed",
}, null, 2))

process.exitCode = failed.length === 0 ? 0 : 1
