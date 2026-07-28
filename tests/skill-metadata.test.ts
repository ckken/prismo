import { describe, expect, test } from "bun:test"
import { readdir } from "node:fs/promises"
import { basename, join } from "node:path"

const skillsDir = join(import.meta.dir, "../skills")

describe("published Skill metadata", () => {
  test("every Skill has safe, installable frontmatter", async () => {
    const entries = await readdir(skillsDir, { withFileTypes: true })
    const skills = entries.filter((entry) => entry.isDirectory())

    expect(skills.length).toBeGreaterThan(0)
    for (const skill of skills) {
      const file = Bun.file(join(skillsDir, skill.name, "SKILL.md"))
      expect(await file.exists()).toBe(true)

      const match = (await file.text()).match(/^---\n([\s\S]*?)\n---/)
      expect(match).not.toBeNull()
      const frontmatter = Object.fromEntries(match![1].split("\n").filter(Boolean).map((line) => {
        const separator = line.indexOf(":")
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()]
      }))

      expect(Object.keys(frontmatter).sort()).toEqual(["description", "name"])
      expect(frontmatter.name).toBe(basename(join(skillsDir, skill.name)))
      expect(frontmatter.name).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      expect(frontmatter.description.length).toBeGreaterThan(0)
      expect(frontmatter.description.length).toBeLessThanOrEqual(1024)
      expect(frontmatter.description).not.toMatch(/[<>]/)
    }
  })
})
