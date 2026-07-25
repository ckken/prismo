import { resolve } from "node:path"

const skillDir = resolve(process.argv[2] ?? "skills/shadcn-agent-kit")
const skillFile = Bun.file(resolve(skillDir, "SKILL.md"))

if (!await skillFile.exists()) throw new Error("SKILL.md not found")

const content = await skillFile.text()
const match = content.match(/^---\n([\s\S]*?)\n---/)
if (!match) throw new Error("Invalid or missing YAML frontmatter")

const entries = match[1]
  .split("\n")
  .filter((line) => line.trim())
  .map((line) => {
    const separator = line.indexOf(":")
    if (separator < 1) throw new Error(`Invalid frontmatter line: ${line}`)
    return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()] as const
  })
const frontmatter = Object.fromEntries(entries)
const allowed = new Set(["name", "description"])
const unexpected = Object.keys(frontmatter).filter((key) => !allowed.has(key))

if (unexpected.length) throw new Error(`Unexpected frontmatter keys: ${unexpected.join(", ")}`)
if (!frontmatter.name) throw new Error("Missing name")
if (!frontmatter.description) throw new Error("Missing description")
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(frontmatter.name)) throw new Error("Name must use hyphen-case")
if (frontmatter.name.length > 64) throw new Error("Name exceeds 64 characters")
if (frontmatter.description.length > 1024) throw new Error("Description exceeds 1024 characters")
if (/[<>]/.test(frontmatter.description)) throw new Error("Description cannot contain angle brackets")

console.log("Skill is valid!")
