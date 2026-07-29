import { Button, Card, Chip } from "@heroui/react"
import { ArrowRight, Check, CircleDashed, Code2, FileCheck2, Github, Route, ShieldCheck, Sparkles } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { AgenicMark } from "./components/logo"
import "./agenic-pages.css"

const recipes = [
  { name: "Dashboard overview", id: "dashboard-overview-01", status: "Available", description: "A decision-ready overview with metrics, trend, ranked signals, and a stable data boundary." },
  { name: "Revenue operations", id: "revenue-operations", status: "Candidate", description: "Pipeline health, team performance, and account follow-up for revenue teams." },
  { name: "Commerce operations", id: "commerce-operations", status: "Candidate", description: "Orders, product performance, channel mix, and fulfillment signals." },
  { name: "Content intelligence", id: "content-intelligence", status: "Candidate", description: "Editorial output, topic momentum, distribution, and content quality." },
]

const stages = [
  { icon: Sparkles, label: "Intent", title: "Understand the real request", copy: "Read the request, repository constraints, and route that must work." },
  { icon: FileCheck2, label: "Spec", title: "Make decisions reviewable", copy: "Turn intent into a stable contract before touching the target application." },
  { icon: Code2, label: "Recipe", title: "Compose an editable UI", copy: "Resolve an available Recipe and adapt it through an explicit data boundary." },
  { icon: Route, label: "Adapt", title: "Mount the real route", copy: "Integrate with the target project instead of stopping at a detached preview." },
  { icon: ShieldCheck, label: "Verify", title: "Test what users reach", copy: "Check behavior and the actual browser route, not only generated files." },
  { icon: Check, label: "Proof", title: "Leave evidence behind", copy: "Record passed, failed, and unverified claims in a versioned handoff." },
]

function SiteHeader() {
  const navigate = useNavigate()
  return (
    <header className="agenic-site-header">
      <button className="agenic-site-brand" type="button" onClick={() => void navigate({ to: "/" })}>
        <AgenicMark /><span>Agenic</span>
      </button>
      <nav aria-label="Primary">
        <button type="button" onClick={() => void navigate({ to: "/catalog" })}>Recipes</button>
        <button type="button" onClick={() => void navigate({ to: "/workflow" })}>How it works</button>
        <a href={__PUBLIC_REPOSITORY_URL__} target="_blank" rel="noreferrer"><Github aria-hidden="true" />GitHub</a>
      </nav>
    </header>
  )
}

function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <section className="agenic-page-intro">
      <Chip size="sm" variant="soft">{eyebrow}</Chip>
      <h1>{title}</h1>
      <p>{copy}</p>
    </section>
  )
}

export function AgenicCatalogPage() {
  const navigate = useNavigate()
  return (
    <main className="agenic-page">
      <SiteHeader />
      <PageIntro eyebrow="Recipe catalog" title="Start from a proven direction." copy="Recipes are editable UI compositions with declared data and verification boundaries—not screenshots or opaque templates." />
      <section className="agenic-recipe-grid" aria-label="Recipe catalog">
        {recipes.map((recipe, index) => (
          <Card key={recipe.id} className={`agenic-recipe-card ${index === 0 ? "is-available" : ""}`}>
            <Card.Header>
              <div className="agenic-recipe-icon">{index === 0 ? <ShieldCheck /> : <CircleDashed />}</div>
              <Chip size="sm" color={index === 0 ? "success" : "default"} variant="soft">{recipe.status}</Chip>
            </Card.Header>
            <Card.Content>
              <p className="agenic-recipe-id">{recipe.id}</p>
              <Card.Title>{recipe.name}</Card.Title>
              <Card.Description>{recipe.description}</Card.Description>
            </Card.Content>
            <Card.Footer>
              {index === 0 ? (
                <Button variant="primary" onPress={() => void navigate({ to: "/dashboard/$dashboardId", params: { dashboardId: "default" } })}>Open live Recipe <ArrowRight /></Button>
              ) : <span>Exploration only · not installable</span>}
            </Card.Footer>
          </Card>
        ))}
      </section>
    </main>
  )
}

export function AgenicWorkflowPage() {
  const navigate = useNavigate()
  return (
    <main className="agenic-page">
      <SiteHeader />
      <PageIntro eyebrow="Agent-first delivery" title="A chain you can inspect." copy="Agenic gives coding agents a deterministic local path from a UI request to route-level evidence and a handoff another agent can trust." />
      <section className="agenic-workflow-grid" aria-label="Agenic workflow">
        {stages.map(({ icon: Icon, label, title, copy }, index) => (
          <article key={label}>
            <div className="agenic-workflow-number">0{index + 1}</div>
            <div className="agenic-workflow-icon"><Icon aria-hidden="true" /></div>
            <p>{label}</p><h2>{title}</h2><span>{copy}</span>
          </article>
        ))}
      </section>
      <section className="agenic-workflow-cta">
        <div><p>See the contract in context</p><h2>Explore the Available Recipe.</h2></div>
        <Button size="lg" variant="primary" onPress={() => void navigate({ to: "/dashboard/$dashboardId", params: { dashboardId: "default" } })}>Open dashboard <ArrowRight /></Button>
      </section>
    </main>
  )
}
