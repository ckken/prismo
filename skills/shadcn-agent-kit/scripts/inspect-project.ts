import { resolve } from "node:path"

const target = resolve(process.argv[2] ?? process.cwd())
const readJson = async (path: string) => {
  const file = Bun.file(path)
  return await file.exists() ? await file.json() : null
}

const packageJson = await readJson(resolve(target, "package.json"))
const components = await readJson(resolve(target, "components.json"))
const files = await Array.fromAsync(new Bun.Glob("{bun.lock,bun.lockb,pnpm-lock.yaml,yarn.lock,package-lock.json,AGENTS.md,src/**/router*.{ts,tsx},src/**/route*.{ts,tsx}}" ).scan({ cwd: target, onlyFiles: true }))

const manager = files.includes("bun.lock") || files.includes("bun.lockb")
  ? "bun"
  : files.includes("pnpm-lock.yaml")
    ? "pnpm"
    : files.includes("yarn.lock")
      ? "yarn"
      : files.includes("package-lock.json")
        ? "npm"
        : packageJson?.packageManager?.split("@")[0] ?? "unknown"

const dependencies = { ...packageJson?.dependencies, ...packageJson?.devDependencies }

console.log(JSON.stringify({
  target,
  packageManager: manager,
  react: dependencies?.react ?? null,
  typescript: dependencies?.typescript ?? null,
  rsbuild: dependencies?.["@rsbuild/core"] ?? null,
  tanstack: Object.fromEntries(Object.entries(dependencies ?? {}).filter(([name]) => name.startsWith("@tanstack/"))),
  shadcn: components ? {
    style: components.style ?? null,
    rsc: components.rsc ?? null,
    aliases: components.aliases ?? null,
  } : null,
  relevantFiles: files.sort(),
  risks: [
    !packageJson && "missing package.json",
    !components && "missing components.json; shadcn init may be required",
    manager === "unknown" && "package manager not confirmed",
  ].filter(Boolean),
}, null, 2))
