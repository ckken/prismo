import { inspectProject } from "../../../packages/dashboard-agent/src/core.ts"

console.log(JSON.stringify(await inspectProject(process.argv[2] ?? process.cwd()), null, 2))
