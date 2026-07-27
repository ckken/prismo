import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { dashboardOverviewRecipe, SHADCN_CLI_VERSION } from "../packages/dashboard-agent/src/catalog.ts"

const root = resolve(import.meta.dir, "..")
const fixture = await mkdtemp(join(tmpdir(), "shadcn-agent-kit-proof-"))
const registryItem = await Bun.file(resolve(root, `apps/web/public/r/${dashboardOverviewRecipe.id}.json`)).text()

async function write(path: string, content: string) {
  await Bun.write(resolve(fixture, path), content)
}

async function run(label: string, command: string[]) {
  const process = Bun.spawn(command, { cwd: fixture, stdout: "pipe", stderr: "pipe" })
  const [exitCode, stdout, stderr] = await Promise.all([
    process.exited,
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
  ])
  if (exitCode !== 0) throw new Error(`${label} failed\n${stdout}\n${stderr}`)
  console.log(`passed: ${label}`)
}

const server = Bun.serve({
  port: 0,
  fetch(request) {
    return new URL(request.url).pathname === `/${dashboardOverviewRecipe.id}.json`
      ? new Response(registryItem, { headers: { "content-type": "application/json" } })
      : new Response("Not found", { status: 404 })
  },
})

try {
  await Promise.all([
    write("package.json", `${JSON.stringify({
      name: "shadcn-agent-kit-proof",
      private: true,
      type: "module",
      packageManager: "bun@1.3.14",
      dependencies: {
        "class-variance-authority": "0.7.1",
        clsx: "2.1.1",
        react: "19.2.8",
        "react-dom": "19.2.8",
        "tailwind-merge": "3.4.0",
      },
      devDependencies: {
        "@rsbuild/core": "2.1.8",
        "@rsbuild/plugin-react": "2.1.0",
        "@tailwindcss/postcss": "4.3.3",
        "@types/react": "19.2.10",
        "@types/react-dom": "19.2.3",
        tailwindcss: "4.3.3",
        typescript: "7.0.2",
      },
    }, null, 2)}\n`),
    write("components.json", `${JSON.stringify({
      $schema: "https://ui.shadcn.com/schema.json",
      style: "new-york",
      rsc: false,
      tsx: true,
      tailwind: { config: "", css: "src/styles.css", baseColor: "neutral", cssVariables: true, prefix: "" },
      iconLibrary: "lucide",
      aliases: { components: "@/components", utils: "@/lib/utils", ui: "@/components/ui", lib: "@/lib", hooks: "@/hooks" },
    }, null, 2)}\n`),
    write("tsconfig.json", `${JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        strict: true,
        noEmit: true,
        jsx: "react-jsx",
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        skipLibCheck: true,
        paths: { "@/*": ["./src/*"] },
      },
      include: ["src", "proof-states.tsx"],
    }, null, 2)}\n`),
    write("rsbuild.config.ts", `import { defineConfig } from "@rsbuild/core"\nimport { pluginReact } from "@rsbuild/plugin-react"\nexport default defineConfig({ plugins: [pluginReact()] })\n`),
    write("postcss.config.mjs", `export default { plugins: { "@tailwindcss/postcss": {} } }\n`),
    write("src/env.d.ts", `declare module "*.css"\n`),
    write("src/styles.css", `@import "tailwindcss";\n`),
    write("src/lib/utils.ts", `import { clsx, type ClassValue } from "clsx"\nimport { twMerge } from "tailwind-merge"\nexport function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }\n`),
    write("src/index.tsx", `import { createRoot } from "react-dom/client"\nimport { DashboardOverview01 } from "./components/dashboard-overview-01"\nimport "./styles.css"\nconst root = document.getElementById("root")\nif (!root) throw new Error("Missing #root")\ncreateRoot(root).render(<DashboardOverview01 />)\n`),
    write("proof-states.tsx", `import { renderToStaticMarkup } from "react-dom/server"\nimport { DashboardOverview01, type DashboardOverviewData, type DashboardOverviewState } from "./src/components/dashboard-overview-01"\nconst cases: Array<[DashboardOverviewState, DashboardOverviewData | undefined, string]> = [\n  ["success", undefined, "Priority accounts"],\n  ["loading", undefined, "animate-pulse"],\n  ["empty", undefined, "No records in this range"],\n  ["contract-error", {} as DashboardOverviewData, "Contract mismatch"],\n]\nfor (const [state, data, expected] of cases) {\n  const html = renderToStaticMarkup(<DashboardOverview01 state={state} data={data} />)\n  if (!html.includes(expected)) throw new Error(state + " state did not render " + expected)\n}\nconsole.log("passed: four explicit data states")\n`),
  ])

  await run("fixture dependency install", ["bun", "install"])
  const registryUrl = `http://127.0.0.1:${server.port}/${dashboardOverviewRecipe.id}.json`
  await run("shadcn registry dry-run", ["bunx", "--bun", `shadcn@${SHADCN_CLI_VERSION}`, "add", registryUrl, "--dry-run"])
  await run("shadcn registry add", ["bunx", "--bun", `shadcn@${SHADCN_CLI_VERSION}`, "add", registryUrl, "--yes"])
  await run("TypeScript 7 noEmit", ["bunx", "tsc", "--noEmit"])
  await run("four explicit data states", ["bun", "proof-states.tsx"])
  await run("Rsbuild production build", ["bunx", "rsbuild", "build"])
  console.log("Proof install completed.")
} finally {
  server.stop(true)
  await rm(fixture, { recursive: true, force: true })
}
