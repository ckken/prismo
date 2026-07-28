import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"

const skillDir = resolve(process.argv[2] ?? "skills/agenic-agent-kit")
const outfile = resolve(skillDir, "scripts/dashboard-agent.js")

await mkdir(dirname(outfile), { recursive: true })

const result = await Bun.build({
  entrypoints: [resolve("packages/dashboard-agent/src/cli.ts")],
  outdir: dirname(outfile),
  naming: "dashboard-agent.js",
  target: "bun",
  format: "esm",
  sourcemap: "none",
})

if (!result.success) {
  for (const log of result.logs) console.error(log)
  process.exit(1)
}

const bundle = await readFile(outfile, "utf8")
if (bundle.includes("sourceMappingURL") || bundle.includes(resolve("packages/dashboard-agent"))) {
  throw new Error("Skill bundle must not contain sourcemaps or repository source paths")
}

await writeFile(outfile, bundle.endsWith("\n") ? bundle : `${bundle}\n`)
console.log(`Built ${outfile}`)
