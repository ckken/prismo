#!/usr/bin/env bun
// @bun

// packages/dashboard-agent/src/core.ts
import { existsSync, readdirSync, readFileSync } from "fs";
import { dirname, join, resolve } from "path";

// packages/dashboard-agent/src/catalog.ts
var SHADCN_CLI_VERSION = "4.14.1";
var PUBLIC_REGISTRY_BASE_URL = "https://ckken.github.io/agenic/r";
var dashboardOverviewRecipe = {
  id: "dashboard-overview-01",
  title: "Dashboard Overview 01",
  description: "A contract-aware admin dashboard with responsive sidebar navigation, command search, charts, a managed table, and four explicit data states.",
  status: "Available",
  installable: true,
  registryUrl: `${PUBLIC_REGISTRY_BASE_URL}/dashboard-overview-01.json`,
  capabilities: ["metric-grid", "trend-chart", "data-table", "controlled-query", "four-states"],
  tableLevel: "L2",
  states: ["success", "loading", "empty", "contract-error"],
  dependencies: ["@tanstack/react-table", "lucide-react", "recharts", "zod"],
  registryDependencies: ["badge", "button", "card", "chart", "input", "separator", "sidebar", "skeleton", "table"]
};
var catalog = [
  dashboardOverviewRecipe,
  {
    id: "sales-command-center",
    title: "Sales Command Center",
    description: "Targets, forecasting, ranking, pipeline, and server-filtered accounts.",
    status: "Candidate",
    installable: false,
    registryUrl: null,
    capabilities: ["sales-target", "sales-trend", "rep-ranking", "customer-table"],
    tableLevel: "L2",
    states: ["success", "loading", "empty", "contract-error"]
  },
  {
    id: "commerce-operations",
    title: "Commerce Operations",
    description: "GMV, conversion, channels, orders, products, and batch actions.",
    status: "Candidate",
    installable: false,
    registryUrl: null,
    capabilities: ["gmv", "conversion", "orders", "products", "batch-actions"],
    tableLevel: "L2",
    states: ["success", "loading", "empty", "contract-error"]
  },
  {
    id: "agent-operations",
    title: "Agent Operations",
    description: "Usage, cost, latency, errors, traces, and model mix.",
    status: "Candidate",
    installable: false,
    registryUrl: null,
    capabilities: ["usage", "cost", "latency", "errors", "traces", "model-mix"],
    tableLevel: "L2",
    states: ["success", "loading", "empty", "contract-error"]
  },
  {
    id: "crm-workspace",
    title: "CRM Workspace",
    description: "Customers, pipeline stages, follow-ups, and tasks.",
    status: "Candidate",
    installable: false,
    registryUrl: null,
    capabilities: ["customers", "pipeline", "follow-ups", "tasks"],
    tableLevel: "L2",
    states: ["success", "loading", "empty", "contract-error"]
  },
  {
    id: "finance-review",
    title: "Finance Review",
    description: "Income, budget, anomalies, and reconciliation.",
    status: "Candidate",
    installable: false,
    registryUrl: null,
    capabilities: ["income", "budget", "anomalies", "reconciliation"],
    tableLevel: "L2",
    states: ["success", "loading", "empty", "contract-error"]
  }
];

// packages/dashboard-agent/src/core.ts
var ignoredDirectories = new Set(["node_modules", ".git", ".next", ".turbo", "build", "dist", "coverage"]);
var lockfiles = [
  ["bun.lock", "bun"],
  ["bun.lockb", "bun"],
  ["pnpm-lock.yaml", "pnpm"],
  ["yarn.lock", "yarn"],
  ["package-lock.json", "npm"]
];
class DashboardAgentError extends Error {
  code;
  candidates;
  constructor(code, message, candidates = []) {
    super(message);
    this.code = code;
    this.candidates = candidates;
  }
}
function findComponentsJson(cwd) {
  const start = resolve(cwd);
  if (!existsSync(start))
    throw new DashboardAgentError("NOT_FOUND", `Target directory does not exist: ${start}.`);
  const found = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!ignoredDirectories.has(entry.name))
          visit(join(directory, entry.name));
      } else if (entry.isFile() && entry.name === "components.json") {
        found.push(join(directory, entry.name));
      }
    }
  };
  visit(start);
  return found.sort();
}
function selectProjectDir(cwd) {
  const matches = findComponentsJson(cwd);
  if (matches.length === 0)
    throw new DashboardAgentError("NOT_FOUND", `No components.json found below ${resolve(cwd)}.`);
  if (matches.length > 1)
    throw new DashboardAgentError("AMBIGUOUS", "Multiple components.json files found; pass --cwd for one project.", matches);
  return dirname(matches[0]);
}
function readPackageManifest(directory) {
  const manifest = join(directory, "package.json");
  if (!existsSync(manifest))
    return null;
  try {
    return JSON.parse(readFileSync(manifest, "utf8"));
  } catch {
    return null;
  }
}
function packageManagerFromManifest(rootDir) {
  const value = readPackageManifest(rootDir);
  if (!value)
    return "unknown";
  try {
    const manager = value.packageManager?.split("@")[0];
    return manager === "bun" || manager === "pnpm" || manager === "yarn" || manager === "npm" ? manager : "unknown";
  } catch {
    return "unknown";
  }
}
function getProjectProfile(projectDir) {
  let current = resolve(projectDir);
  let rootDir = current;
  let lockfile = null;
  let packageManager = "unknown";
  while (true) {
    const lock = lockfiles.find(([name]) => existsSync(join(current, name)));
    if (lock) {
      rootDir = current;
      lockfile = join(current, lock[0]);
      packageManager = lock[1];
      break;
    }
    if (existsSync(join(current, ".git"))) {
      rootDir = current;
      break;
    }
    const parent = dirname(current);
    if (parent === current)
      break;
    current = parent;
  }
  if (!lockfile)
    packageManager = packageManagerFromManifest(rootDir);
  const resolvedProjectDir = resolve(projectDir);
  const manifest = readPackageManifest(resolvedProjectDir);
  const dependencies = { ...manifest?.dependencies, ...manifest?.devDependencies };
  const routerPackages = Object.keys(dependencies).filter((name) => name === "next" || name === "wouter" || name === "react-router" || name === "react-router-dom" || name.startsWith("@tanstack/react-router") || name.startsWith("@remix-run/"));
  const agentInstructionFiles = [...new Set([
    join(rootDir, "AGENTS.md"),
    join(resolvedProjectDir, "AGENTS.md")
  ].filter(existsSync))];
  const packageScripts = manifest?.scripts ?? {};
  const risks = [
    packageManager === "unknown" ? "package-manager-unknown" : null,
    routerPackages.length === 0 ? "router-not-detected" : null,
    !packageScripts.typecheck ? "typecheck-script-not-detected" : null,
    !packageScripts.build ? "build-script-not-detected" : null
  ].filter((risk) => risk !== null);
  return {
    projectDir: resolvedProjectDir,
    componentsJson: join(resolvedProjectDir, "components.json"),
    rootDir,
    lockfile,
    packageManager,
    packageScripts,
    routerPackages,
    agentInstructionFiles,
    risks,
    shadcn: null
  };
}
function shellQuote(value) {
  return /^[a-zA-Z0-9_./:@=-]+$/.test(value) ? value : `'${value.replaceAll("'", "'\\''")}'`;
}
function createInstallPlan(packageManager, projectDir) {
  const prefix = packageManager === "pnpm" ? ["pnpm", "dlx"] : packageManager === "yarn" ? ["yarn", "dlx"] : packageManager === "npm" ? ["npx"] : ["bunx", "--bun"];
  const argv = [...prefix, `shadcn@${SHADCN_CLI_VERSION}`, "add", dashboardOverviewRecipe.registryUrl, "--dry-run", "-c", projectDir];
  return { executable: false, argv, command: argv.map(shellQuote).join(" ") };
}
var domainRules = [
  { intent: "agent-operations", recipe: "agent-operations", pattern: /agent[\s-]*(ops|operations)|\btoken(s)?\b|\bp95\b|latency|trace(s)?|\u667A\u80FD\u4F53|\u6A21\u578B\u8C03\u7528|\u8C03\u7528\u91CF|\u5EF6\u8FDF|\u9519\u8BEF\u7387/i },
  { intent: "sales", recipe: "sales-command-center", pattern: /\bsales\b|\bpipeline\b|\bquota\b|sales forecast|\u9500\u552E|\u5546\u673A|\u7EBF\u7D22|\u9500\u552E\u6F0F\u6597/i },
  { intent: "commerce", recipe: "commerce-operations", pattern: /\be-?commerce\b|\bgmv\b|\border(s)?\b|\bproduct(s)?\b|\u7535\u5546|\u8BA2\u5355|\u5546\u54C1|\u8F6C\u5316\u7387/i },
  { intent: "crm", recipe: "crm-workspace", pattern: /\bcrm\b|customer lifecycle|\u5BA2\u6237\u9636\u6BB5|\u5BA2\u6237\u8DDF\u8FDB/i },
  { intent: "finance", recipe: "finance-review", pattern: /\bbudget\b|reconciliation|finance review|\u9884\u7B97|\u5BF9\u8D26|\u8D22\u52A1\u590D\u76D8/i }
];
var forbiddenRules = [
  { id: "spreadsheet-grid", pattern: /\bexcel\b|spreadsheet|formula|cell edit|\u51BB\u7ED3(\u5217|\u884C|\u533A)|\u516C\u5F0F|\u5355\u5143\u683C\u7F16\u8F91/i },
  { id: "application-security", pattern: /\baudit\b|permission(s)?|role-based|\u5BA1\u8BA1|\u6743\u9650/i },
  { id: "background-export", pattern: /\bexport job\b|batch export|\u540E\u53F0\u5BFC\u51FA|\u5BFC\u51FA\u4EFB\u52A1/i },
  { id: "cross-page-selection", pattern: /cross-page selection|\u8DE8\u9875\u9009\u62E9/i },
  { id: "large-data-virtualization", pattern: /virtuali[sz]ation|100k|\u5341\u4E07|\u767E\u4E07\u884C|\u865A\u62DF\u5316/i }
];
function makeSpec(request) {
  const text = request.toLowerCase();
  const domain = domainRules.find((rule) => rule.pattern.test(text));
  const widgets = [];
  if (/\bkpi(s)?\b|\bmetric(s)?\b|stat cards?|\u6307\u6807|\u6570\u636E\u5361|\u7EDF\u8BA1\u5361/.test(text))
    widgets.push("metric-grid");
  if (/\btrend\b|\bchart(s)?\b|time series|\u8D8B\u52BF|\u56FE\u8868|\u8D70\u52BF\u56FE/.test(text))
    widgets.push("trend-chart");
  if (/\btable\b|\blist\b|\brecords\b|\u8868\u683C|\u5217\u8868|\u660E\u7EC6/.test(text))
    widgets.push("data-table");
  const dataMode = /\bserver\b|\bapi\b|\bremote\b|\u670D\u52A1\u7AEF|\u540E\u7AEF\u63A5\u53E3/.test(text) ? "server" : /\bclient\b|\blocal\b|\bfixture\b|\u5BA2\u6237\u7AEF|\u672C\u5730\u6570\u636E|\u9759\u6001\u6570\u636E/.test(text) ? "client" : "unknown";
  const tableLevel = widgets.includes("data-table") ? dataMode === "server" || /pagination|sorting|filtering|\u5206\u9875|\u6392\u5E8F|\u7B5B\u9009/.test(text) ? "L2" : dataMode === "client" ? "L1" : "unknown" : "unknown";
  const unresolved = ["route", "data-source-contract"];
  if (dataMode === "unknown")
    unresolved.push("data-mode");
  if (widgets.length < 2)
    unresolved.push("dashboard-widgets");
  return {
    schemaVersion: "1",
    request,
    intent: domain?.intent ?? (/dashboard|overview|\u7ECF\u8425\u603B\u89C8|\u603B\u89C8|\u770B\u677F|\u4EEA\u8868\u76D8/.test(text) ? "overview" : "unknown"),
    widgets,
    dataMode,
    tableLevel,
    states: ["success", "loading", "empty", "contract-error"],
    unresolved
  };
}
function selectRecipe(request, spec = makeSpec(request)) {
  const domain = domainRules.find((rule) => rule.intent === spec.intent);
  const candidates = domain ? catalog.filter((item) => item.id === domain.recipe) : [];
  const forbiddenCapabilities = forbiddenRules.filter((rule) => rule.pattern.test(request)).map((rule) => rule.id);
  const matchedCapabilities = dashboardOverviewRecipe.capabilities.filter((capability) => capability === "metric-grid" ? spec.widgets.includes("metric-grid") : capability === "trend-chart" ? spec.widgets.includes("trend-chart") : capability === "data-table" ? spec.widgets.includes("data-table") : capability === "controlled-query" ? spec.tableLevel === "L2" : capability === "four-states");
  const missingCapabilities = ["metric-grid", "data-table"].filter((capability) => !matchedCapabilities.includes(capability));
  if (forbiddenCapabilities.length) {
    return {
      status: "rejected",
      recipe: null,
      reason: "The request includes application or data-grid capabilities outside the Available recipe boundary.",
      candidates,
      matchedCapabilities,
      missingCapabilities,
      forbiddenCapabilities
    };
  }
  if (candidates.length) {
    return {
      status: "rejected",
      recipe: null,
      reason: "A domain-specific Candidate matches, but Candidate recipes are not installable.",
      candidates,
      matchedCapabilities,
      missingCapabilities,
      forbiddenCapabilities
    };
  }
  if (spec.intent === "overview" && missingCapabilities.length === 0) {
    return {
      status: "selected",
      recipe: dashboardOverviewRecipe,
      reason: "Matched the Available overview recipe with metric and table capabilities.",
      candidates: [],
      matchedCapabilities,
      missingCapabilities,
      forbiddenCapabilities
    };
  }
  return {
    status: "clarify",
    recipe: null,
    reason: "No Available recipe can be selected safely. Clarify the dashboard intent and required widgets.",
    candidates: [],
    matchedCapabilities,
    missingCapabilities,
    forbiddenCapabilities
  };
}
function createPlan(cwd, request) {
  const projectDir = selectProjectDir(cwd);
  const projectProfile = getProjectProfile(projectDir);
  const dashboardSpec = makeSpec(request);
  const recipeDecision = selectRecipe(request, dashboardSpec);
  const installPlan = recipeDecision.status === "selected" && projectProfile.packageManager !== "unknown" ? createInstallPlan(projectProfile.packageManager, projectDir) : null;
  const nextActions = installPlan ? ["Review the dry-run command; Agenic has not executed it.", "Resolve the route and data-source contract before apply."] : projectProfile.packageManager === "unknown" && recipeDecision.status === "selected" ? ["Confirm the target package manager before creating an install plan."] : recipeDecision.status === "clarify" ? ["Clarify the dashboard intent and required metric/table widgets."] : ["Use an Available recipe or reduce capabilities to its documented boundary."];
  return {
    dashboardSpec,
    projectProfile,
    recipeDecision,
    installPlan,
    nextActions
  };
}
async function readShadcnInfo(projectDir) {
  const process2 = Bun.spawn(["bunx", "--bun", `shadcn@${SHADCN_CLI_VERSION}`, "info", "--json", "-c", projectDir], { stdout: "pipe", stderr: "pipe" });
  const [exitCode, stdout, stderr] = await Promise.all([process2.exited, new Response(process2.stdout).text(), new Response(process2.stderr).text()]);
  if (exitCode !== 0)
    throw new Error(`shadcn@${SHADCN_CLI_VERSION} info failed (${exitCode}): ${stderr.trim()}`);
  try {
    return JSON.parse(stdout);
  } catch {
    return { raw: stdout.trim() };
  }
}
async function inspectProject(cwd) {
  const projectDir = selectProjectDir(cwd);
  const project = getProjectProfile(projectDir);
  project.shadcn = { source: `shadcn@${SHADCN_CLI_VERSION}`, info: await readShadcnInfo(projectDir) };
  return { kind: "ProjectInspection", version: 1, project };
}
async function createHydratedPlan(cwd, request) {
  const plan = createPlan(cwd, request);
  plan.projectProfile.shadcn = {
    source: `shadcn@${SHADCN_CLI_VERSION}`,
    info: await readShadcnInfo(plan.projectProfile.projectDir)
  };
  return plan;
}

// packages/dashboard-agent/src/cli.ts
var help = `agenic <command> [options]

Commands:
  inspect [--cwd <dir>]                         Inspect a project with shadcn@4.14.1 info.
  plan --request <text> [--cwd <dir>] [--json]  Produce a DashboardSpec and read-only install plan.

Exit codes:
  0  Plan selected or inspection completed
  2  Invalid CLI arguments
  3  Clarification or rejection required
  4  Project discovery failed
  1  Unexpected command failure
`;
function fail(message, exitCode = 2, details) {
  console.error(JSON.stringify({ error: message, exitCode, ...details ? { details } : {} }));
  process.exit(exitCode);
}
function parse(argv) {
  const [command, ...rest] = argv;
  if (!command || command === "--help" || command === "-h")
    return { command: "help" };
  if (command !== "inspect" && command !== "plan")
    fail(`Unknown command: ${command}`);
  const values = {};
  for (let index = 0;index < rest.length; ) {
    const flag = rest[index];
    if (flag === "--json") {
      index += 1;
      continue;
    }
    const value = rest[index + 1];
    if (flag !== "--cwd" && flag !== "--request" || !value || value.startsWith("--"))
      fail(`Invalid argument: ${flag}`);
    if (values[flag])
      fail(`Duplicate argument: ${flag}`);
    values[flag] = value;
    index += 2;
  }
  if (command === "plan" && !values["--request"])
    fail("Missing required argument: --request");
  if (command === "inspect" && values["--request"])
    fail("Invalid argument for inspect: --request");
  return { command, cwd: values["--cwd"] ?? process.cwd(), request: values["--request"] };
}
async function main() {
  const args = parse(process.argv.slice(2));
  if (args.command === "help")
    return console.log(help);
  if (args.command === "plan") {
    const plan = await createHydratedPlan(args.cwd, args.request);
    console.log(JSON.stringify(plan, null, 2));
    if (plan.recipeDecision.status !== "selected" || !plan.installPlan)
      process.exitCode = 3;
    return;
  }
  console.log(JSON.stringify(await inspectProject(args.cwd), null, 2));
}
main().catch((error) => {
  if (error instanceof DashboardAgentError)
    return fail(error.message, 4, error.candidates.length ? { code: error.code, candidates: error.candidates } : { code: error.code });
  fail(error instanceof Error ? error.message : String(error), 1);
});
