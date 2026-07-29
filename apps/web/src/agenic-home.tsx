import { Button, Card, Chip, ProgressBar } from "@heroui/react"
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Code2,
  FileCheck2,
  GitBranch,
  Github,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
} from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { AgenicMark } from "./components/logo"
import "./agenic-home.css"

const deliveryStages = [
  { label: "Intent", detail: "Read the request and project constraints", icon: Sparkles },
  { label: "Spec", detail: "Turn the request into reviewable decisions", icon: FileCheck2 },
  { label: "Recipe", detail: "Select an available, editable UI direction", icon: Code2 },
  { label: "Proof", detail: "Verify the real route and record evidence", icon: ShieldCheck },
]

export function AgenicHomePage() {
  const navigate = useNavigate()

  return (
    <main className="agenic-home">
      <nav className="agenic-home-nav" aria-label="Agenic">
        <button className="agenic-home-brand" type="button" onClick={() => navigate({ to: "/" })}>
          <AgenicMark />
          <span>Agenic</span>
        </button>
        <div className="agenic-home-nav-links">
          <button type="button" onClick={() => navigate({ to: "/catalog" })}>Recipes</button>
          <button type="button" onClick={() => navigate({ to: "/workflow" })}>How it works</button>
          <a href={__PUBLIC_REPOSITORY_URL__} target="_blank" rel="noreferrer"><Github aria-hidden="true" />GitHub</a>
        </div>
      </nav>

      <section className="agenic-home-hero" aria-labelledby="agenic-home-title">
        <Chip size="sm" variant="soft"><span className="agenic-live-dot" />Open-source · local-first</Chip>
        <h1 id="agenic-home-title">UI delivery,<br /><em>made agentic.</em></h1>
        <p>
          Give coding agents a deterministic path from intent to an editable interface,
          a verified route, and proof the next agent can trust.
        </p>
        <div className="agenic-home-actions">
          <Button variant="primary" size="lg" onPress={() => navigate({ to: "/dashboard/$dashboardId", params: { dashboardId: "default" } })}>
            Explore the live Recipe <ArrowRight aria-hidden="true" />
          </Button>
          <Button variant="secondary" size="lg" onPress={() => navigate({ to: "/catalog" })}>
            Browse Recipes
          </Button>
        </div>
        <div className="agenic-home-command" aria-label="Agenic CLI example">
          <TerminalSquare aria-hidden="true" />
          <code>agenic plan --request "Build an operations dashboard" --json</code>
        </div>
      </section>

      <section className="agenic-home-showcase" aria-label="Live Recipe preview">
        <div className="agenic-home-showcase-bar"><span /><span /><span /><p>dashboard-overview-01 · live Recipe</p><Chip size="sm" color="success" variant="soft">Available</Chip></div>
        <div className="agenic-home-showcase-body">
          <aside><AgenicMark /><span>Overview</span><span>Revenue</span><span>Commerce</span><span>Content</span></aside>
          <div className="agenic-home-showcase-content">
            <div className="agenic-home-showcase-heading"><div><small>Tuesday, July 29</small><h2>Good morning, Alex.</h2><p>Here is what needs your attention today.</p></div><Button size="sm" variant="primary">View report</Button></div>
            <div className="agenic-home-mini-metrics"><Card><Card.Content><span>Net revenue</span><strong>$124,860</strong><small>+12.4% this month</small></Card.Content></Card><Card><Card.Content><span>Active accounts</span><strong>1,284</strong><small>+8.2% this month</small></Card.Content></Card><Card><Card.Content><span>Conversion</span><strong>4.82%</strong><small>+0.6% this month</small></Card.Content></Card></div>
            <Card className="agenic-home-chart-card"><Card.Header><div><Card.Title>Revenue momentum</Card.Title><Card.Description>Last 12 weeks</Card.Description></div><BarChart3 /></Card.Header><Card.Content><svg viewBox="0 0 620 170" preserveAspectRatio="none" role="img" aria-label="Revenue trend preview"><defs><linearGradient id="home-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".22"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></linearGradient></defs><path d="M0 144 C55 132 71 112 117 120 S185 91 233 101 S307 54 360 72 S431 31 482 47 S553 13 620 20 L620 170 L0 170Z" fill="url(#home-area)"/><path d="M0 144 C55 132 71 112 117 120 S185 91 233 101 S307 54 360 72 S431 31 482 47 S553 13 620 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg></Card.Content></Card>
          </div>
        </div>
      </section>

      <section className="agenic-home-flow">
        <div className="agenic-home-section-heading"><p>Built for agent delivery</p><h2>From a sentence to evidence.</h2><span>Every stage is inspectable, local, and designed to leave the repository easier for the next agent to understand.</span></div>
        <div className="agenic-home-proof" aria-label="Agenic delivery flow">
          {deliveryStages.map(({ label, detail, icon: Icon }, index) => (
            <article className="agenic-home-stage" key={label}><span className="agenic-home-stage-index">0{index + 1}</span><Icon aria-hidden="true" /><h3>{label}</h3><p>{detail}</p></article>
          ))}
        </div>
      </section>

      <section className="agenic-home-demo" aria-labelledby="agenic-home-demo-title">
        <div><Chip size="sm" variant="soft">Proof, not promises</Chip><h2 id="agenic-home-demo-title">Done means the real route works.</h2><p>Agenic records the Spec, data boundary, route evidence, and anything still unverified. A preview alone is never presented as delivery.</p><button className="agenic-home-text-link" type="button" onClick={() => navigate({ to: "/workflow" })}>See the full delivery chain <ArrowRight aria-hidden="true" /></button></div>
        <Card className="agenic-home-proof-card">
          <div className="agenic-home-proof-card-head"><GitBranch aria-hidden="true" /><span>ProofReport</span><small>route verified</small></div>
          <div className="agenic-home-check"><CheckCircle2 aria-hidden="true" /><span>DashboardSpec selected</span><b>passed</b></div>
          <div className="agenic-home-check"><CheckCircle2 aria-hidden="true" /><span>Data Adapter isolated</span><b>passed</b></div>
          <div className="agenic-home-check"><CheckCircle2 aria-hidden="true" /><span>Live route evidence</span><b>passed</b></div>
          <div className="agenic-home-proof-progress"><span>Handoff confidence <b>3 / 3</b></span><ProgressBar aria-label="Handoff confidence" value={100}/></div>
          <div className="agenic-home-proof-card-foot">Passed, failed, and unverified remain explicit.</div>
        </Card>
      </section>
    </main>
  )
}
