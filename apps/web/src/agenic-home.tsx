import { Button } from "@heroui/react"
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  FileCheck2,
  GitBranch,
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
          <button type="button" onClick={() => navigate({ to: "/workflow" })}>Workflow</button>
          <button type="button" onClick={() => navigate({ to: "/catalog" })}>Catalog</button>
          <a href={__PUBLIC_REPOSITORY_URL__} target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </nav>

      <section className="agenic-home-hero" aria-labelledby="agenic-home-title">
        <div className="agenic-home-eyebrow"><span />Open-source Agent-first UI delivery</div>
        <h1 id="agenic-home-title">Give your coding agent<br /><em>agency with proof.</em></h1>
        <p>
          Agenic turns UI intent into a reviewable Spec, editable Recipe composition,
          real route evidence, and a ProofReport your next Agent can trust.
        </p>
        <div className="agenic-home-actions">
          <Button variant="primary" size="lg" onPress={() => navigate({ to: "/dashboard/$dashboardId", params: { dashboardId: "default" } })}>
            Explore the live Recipe <ArrowRight aria-hidden="true" />
          </Button>
          <Button variant="secondary" size="lg" onPress={() => navigate({ to: "/workflow" })}>
            See the delivery chain
          </Button>
        </div>
        <div className="agenic-home-command" aria-label="Agenic CLI example">
          <TerminalSquare aria-hidden="true" />
          <code>agenic plan --request "Build an operations dashboard" --json</code>
        </div>
      </section>

      <section className="agenic-home-proof" aria-label="Agenic delivery flow">
        {deliveryStages.map(({ label, detail, icon: Icon }, index) => (
          <article className="agenic-home-stage" key={label}>
            <span className="agenic-home-stage-index">0{index + 1}</span>
            <Icon aria-hidden="true" />
            <h2>{label}</h2>
            <p>{detail}</p>
          </article>
        ))}
      </section>

      <section className="agenic-home-demo" aria-labelledby="agenic-home-demo-title">
        <div>
          <p className="agenic-home-kicker">The first Available Recipe</p>
          <h2 id="agenic-home-demo-title">A dashboard is not done<br />until the route proves it.</h2>
          <p>
            Start from an actual implementation: an editable Dashboard Recipe,
            one Data Adapter boundary, deterministic fixtures, and explicit passed,
            failed, and unverified evidence.
          </p>
          <button className="agenic-home-text-link" type="button" onClick={() => navigate({ to: "/dashboard/$dashboardId", params: { dashboardId: "default" } })}>
            Open dashboard-overview-01 <ArrowRight aria-hidden="true" />
          </button>
        </div>
        <div className="agenic-home-proof-card">
          <div className="agenic-home-proof-card-head"><GitBranch aria-hidden="true" /><span>ProofReport</span><small>route verified</small></div>
          <div className="agenic-home-check"><CheckCircle2 aria-hidden="true" /><span>DashboardSpec selected</span><b>passed</b></div>
          <div className="agenic-home-check"><CheckCircle2 aria-hidden="true" /><span>Data Adapter isolated</span><b>passed</b></div>
          <div className="agenic-home-check"><CheckCircle2 aria-hidden="true" /><span>Live route evidence</span><b>passed</b></div>
          <div className="agenic-home-proof-card-foot">Agenic records what it knows—and what remains unverified.</div>
        </div>
      </section>
    </main>
  )
}
