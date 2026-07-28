import { afterEach, describe, expect, test } from "bun:test"
import { chmodSync, cpSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

const directories: string[] = []

function fixture(): string {
  const directory = mkdtempSync(join(tmpdir(), "shadcn-agent-skill-"))
  directories.push(directory)
  return directory
}

function runSkill(skillDir: string, args: string[], env: Record<string, string | undefined> = {}) {
  return Bun.spawnSync(["bun", join(skillDir, "scripts/dashboard-agent.js"), ...args], {
    stdout: "pipe",
    stderr: "pipe",
    env: { ...process.env, ...env },
  })
}

afterEach(() => directories.splice(0).forEach((directory) => rmSync(directory, { recursive: true, force: true })))

describe("shadcn-agent-kit standalone bundle", () => {
  test("runs after the skill directory is copied outside the repository", async () => {
    const root = fixture()
    const skillDir = join(root, "installed-skill")
    cpSync(join(import.meta.dir, "../skills/shadcn-agent-kit"), skillDir, { recursive: true })

    const help = runSkill(skillDir, ["--help"])
    expect(help.exitCode).toBe(0)
    expect(new TextDecoder().decode(help.stdout)).toContain("prismo <command>")

    const project = join(root, "project")
    mkdirSync(project)
    writeFileSync(join(project, "components.json"), "{}")
    writeFileSync(join(project, "package.json"), JSON.stringify({ packageManager: "bun@1.3.14" }))
    const bin = join(root, "bin")
    mkdirSync(bin)
    const bunx = join(bin, "bunx")
    writeFileSync(bunx, "#!/bin/sh\necho '{\"fixtures\":true}'\n")
    chmodSync(bunx, 0o755)
    const candidate = runSkill(skillDir, ["plan", "--cwd", project, "--request", "agent ops token p95 dashboard", "--json"], {
      PATH: `${bin}:${process.env.PATH ?? ""}`,
    })
    expect(candidate.exitCode).toBe(3)
    expect(new TextDecoder().decode(candidate.stdout)).toContain('"status": "rejected"')
  })
})
