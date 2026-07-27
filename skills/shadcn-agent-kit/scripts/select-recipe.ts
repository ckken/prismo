import { makeSpec, selectRecipe } from "../../../packages/dashboard-agent/src/core.ts"

const request = process.argv.slice(2).join(" ").trim()
const dashboardSpec = makeSpec(request)
const recipeDecision = selectRecipe(request, dashboardSpec)

console.log(JSON.stringify({ dashboardSpec, recipeDecision }, null, 2))
process.exitCode = recipeDecision.status === "selected" ? 0 : 3
