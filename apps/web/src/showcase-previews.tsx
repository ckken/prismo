import { useMemo, useState } from "react"
import { Button, Card, Chip } from "@heroui/react"
import {
  Archive,
  Bot,
  ChevronDown,
  Clock3,
  Compass,
  FileText,
  Inbox,
  Library,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  User,
} from "lucide-react"
import { AgenicMark } from "./components/logo"
import "./showcase-previews.css"

const emailItems = [
  ["Carlos Iglesias", "Launch recap + next steps", "We agreed on the final launch date and the three must-ship items.", "10:21 AM", "green"],
  ["Stripe", "Invoice INV-0241 is due tomorrow", "Invoice INV-0241 for $2,450.00 is due tomorrow.", "Yesterday", "blue"],
  ["Flights", "Flight itinerary: SFO → NRT", "You're booked on flight FL-482 from SFO to NRT.", "Apr 22", "orange"],
  ["GitHub", "Review requested on PR #242", "Review requested on #242 — fix the bounded chat height.", "9:02 AM", "dark"],
  ["Maya Okafor", "Design review: dashboard v3", "Final dashboard layout, chart colors, and responsive table.", "Mon", "cyan"],
  ["Amelia from Linear", "Your weekly summary", "8 issues closed and your cycle is on track.", "Mon", "mint"],
  ["Ravi Anand", "Dinner plans for Saturday?", "Are we still on for dinner this Saturday?", "Sun", "pink"],
  ["Parker Wren", "1:1 notes — Q2 growth plan", "Define H1 north-star and pick two experiments.", "Fri", "violet"],
]

export function ComponentsPreview() {
  const [notifications, setNotifications] = useState(true)
  const [progress, setProgress] = useState(72)
  return (
    <main className="components-preview">
      <section className="components-grid">
        <Card className="component-form-card"><Card.Content><label>Your email <b>*</b><input defaultValue="john@email.com" /><small>We won't share your email</small></label><label>State <b>*</b><select defaultValue=""><option value="" disabled>Select one</option><option>California</option><option>New York</option><option>Texas</option></select></label><div className="component-controls"><input type="checkbox" defaultChecked /><input type="radio" defaultChecked /><button type="button" className={notifications ? "is-on" : ""} onClick={() => setNotifications((value) => !value)}><i /></button></div><div className="component-price"><span>Price</span><strong>${(progress * 3.47).toFixed(2)}</strong></div><input type="range" min="10" max="100" value={progress} onChange={(event) => setProgress(Number(event.target.value))} /></Card.Content></Card>
        <div className="component-center-stack">
          <div className="component-avatars">{["cyan", "mint", "violet", "orange", "red"].map((tone) => <span className={`is-${tone}`} key={tone} />)}<b>+5</b></div>
          <Card className="component-otp"><Card.Content><strong>Verify account</strong><span>We've sent a code to a****@gmail.com</span><div>{["4", "3", "2", "0", "", ""].map((value, index) => <i key={index}>{value}</i>)}</div><small>Didn't receive a code? <b>Resend</b></small></Card.Content></Card>
          <div className="component-buttons">{["primary", "secondary", "neutral", "danger", "soft", "ghost"].map((variant) => <Button key={variant} size="sm" variant={variant === "primary" ? "primary" : variant === "secondary" ? "secondary" : "ghost"} className={`is-${variant}`}>Click me</Button>)}</div>
        </div>
        <Card className="component-account"><Card.Content><Button isIconOnly size="sm" variant="secondary" aria-label="Close">×</Button><span><User /></span><h2>Create an account</h2><p>Start your free 7-day trial.<br />No credit card required.</p><Button fullWidth variant="primary">Get Started</Button><div>OR</div><Button fullWidth variant="secondary">Continue with Google</Button><Button fullWidth variant="secondary">Continue with Apple</Button></Card.Content></Card>
        <Card className="component-actions"><Card.Content><h3>Actions</h3>{[["New file", "Create a new file", "⌘ N"], ["Edit file", "Make changes", "⌘ E"], ["Delete file", "Move to trash", "⇧ D"]].map(([title, copy, key]) => <div key={title}><FileText /><p><strong>{title}</strong><small>{copy}</small></p><kbd>{key}</kbd></div>)}</Card.Content></Card>
        <Card className="component-profile"><Card.Content><div><AgenicMark /><p><strong>Agenic</strong><span>@agenic_ui</span></p></div><p>Building agent-first UI delivery with verifiable proof.</p><footer><b>12</b> Following <b>8.4K</b> Followers</footer></Card.Content></Card>
        <div className="component-community"><Card><Card.Content><span className="is-orange" /><strong>Agent Builders</strong><small>148 members</small></Card.Content></Card><Card><Card.Content><span className="is-blue" /><strong>UI Engineers</strong><small>362 members</small></Card.Content></Card></div>
        <Card className="component-credit"><Card.Content><div><ShieldCheck /><p><strong>You have 8 proofs left</strong><small>Complete verification to unlock more</small></p></div><Button size="sm" variant="secondary">Inspect</Button></Card.Content></Card>
        <Card className="component-notify"><Card.Content><p><strong>Allow notifications</strong><small>Receive delivery and verification updates</small></p><button type="button" className={notifications ? "is-on" : ""} onClick={() => setNotifications((value) => !value)}><i /></button></Card.Content></Card>
        <Card className="component-confirm"><Card.Content><span><FileText /></span><h3>Unsaved changes</h3><p>Do you want to save or discard changes?</p><div><Button variant="secondary">Discard</Button><Button variant="primary">Save changes</Button></div></Card.Content></Card>
      </section>
    </main>
  )
}

export function MailPreview() {
  const [selected, setSelected] = useState(0)
  const [query, setQuery] = useState("")
  const [readerOpen, setReaderOpen] = useState(true)
  const visible = useMemo(() => emailItems.filter((item) => item.join(" ").toLowerCase().includes(query.toLowerCase())), [query])
  const active = emailItems[selected] ?? emailItems[0]
  return (
    <main className={`mail-preview ${readerOpen ? "is-reader-open" : ""}`}>
      <aside className="mail-sidebar"><div className="mail-user"><AgenicMark /><p><strong>You</strong><small>you@agenic.dev</small></p></div><nav>{[
        { Icon: Inbox, label: "Inbox", count: "4" },
        { Icon: Star, label: "Starred", count: "2" },
        { Icon: Send, label: "Sent", count: "" },
        { Icon: FileText, label: "Drafts", count: "" },
        { Icon: Clock3, label: "Snoozed", count: "" },
        { Icon: Archive, label: "Archive", count: "" },
        { Icon: Trash2, label: "Trash", count: "" },
      ].map(({ Icon, label, count }) => <Button key={label} variant={label === "Inbox" ? "primary" : "ghost"}><Icon />{label}<span>{count}</span></Button>)}</nav><div className="mail-labels"><p>Labels</p>{[["Work", "blue"], ["Personal", "gray"], ["Billing", "amber"], ["Travel", "green"], ["Urgent", "red"]].map(([label, tone]) => <span key={label}><i className={`is-${tone}`} />{label}</span>)}</div><Button variant="primary"><Plus />New email</Button></aside>
      <section className="mail-list"><label><Search /><input aria-label="Search mail" placeholder="Search..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><div>{visible.map((item) => { const index = emailItems.indexOf(item); return <button className={selected === index ? "is-active" : ""} type="button" key={item[1]} onClick={() => { setSelected(index); setReaderOpen(true) }}><span className={`mail-avatar is-${item[4]}`}>{item[0].split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><p><strong>{item[0]}</strong><b>{item[1]}</b><small>{item[2]}</small></p><time>{item[3]}</time><Star /></button> })}</div></section>
      <article className="mail-reader"><header><div><Button isIconOnly variant="secondary" aria-label="Close message" onPress={() => setReaderOpen(false)}>×</Button><Button isIconOnly variant="ghost" aria-label="Delete"><Trash2 /></Button><Button isIconOnly variant="ghost" aria-label="Archive"><Archive /></Button><Button isIconOnly variant="ghost" aria-label="More"><MoreHorizontal /></Button></div><span>1 of 1</span></header><h1>{active[1]}</h1><div className="mail-sender"><span className={`mail-avatar is-${active[4]}`}>{active[0].split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><p><strong>{active[0]}</strong><small>{active[0].toLowerCase().replace(" ", ".")}@agenic.dev<br />to me <ChevronDown /></small></p><time>{active[3]}</time></div><div className="mail-body"><p>Quick recap from this morning's launch review so we have it in writing.</p><p>We agreed on the final launch date and the three must-ship items: onboarding tour, billing update flow, and the new analytics dashboard.</p><p>Parker and I will co-own the go/no-go checklist. Can you sync with me and Maya tomorrow at 10:30?</p></div></article>
    </main>
  )
}

export function ChatPreview() {
  const [message, setMessage] = useState("")
  const [sentMessage, setSentMessage] = useState("")
  const [approved, setApproved] = useState<"approved" | "rejected" | null>(null)
  return (
    <main className="chat-preview">
      <aside className="chat-sidebar"><div className="chat-user"><AgenicMark /><p><strong>Darnell Howe</strong><small>darnell@agenic.dev</small></p></div><nav><Button variant="ghost"><Plus />New Chat</Button><Button variant="ghost"><Library />Library</Button><Button variant="ghost"><Compass />Explore</Button></nav><p>Recent</p>{["Pro AI components showcase", "Quick recipes for dinner", "Launch plan for Q3 rollout", "Rewrite homepage value prop", "Weekly team update summary"].map((item, index) => <Button key={item} variant={index === 0 ? "primary" : "ghost"}><MessageCircle />{item}</Button>)}</aside>
      <section className="chat-shell"><header><div><Button isIconOnly className="chat-menu" variant="ghost" aria-label="Menu"><Menu /></Button><p><strong>Agent delivery showcase</strong><small>Updated just now</small></p></div><div><Button variant="secondary"><Search />Search</Button><Button variant="primary"><Share2 />Share</Button></div></header><div className="chat-thread">
        <div className="chat-user-message">Walk me through the Agenic agent-first delivery components.</div>
        <article className="chat-assistant"><span><Bot /></span><div><Button size="sm" variant="ghost"><Sparkles />Thought for 4 seconds<ChevronDown /></Button><p>Here is a concise answer with markdown and code support:</p><pre><code><b>TS</b>{"\n"}export type DeliveryStatus = "ready" | "applying" | "verified";</code></pre><ul><li>Editable Recipe composition</li><li>Your application owns its data and routes</li><li>Proof records passed, failed, and unverified claims</li></ul></div></article>
        <div className="chat-user-message">Show me tool calls — streaming, grouped, and approval.</div>
        <article className="chat-assistant"><span><Bot /></span><div className="chat-tool"><Button size="sm" variant="ghost">2 tool calls<ChevronDown /></Button><Card><Card.Content><strong>Approval needed: publishPreview</strong><code>{"{\"route\":\"/dashboard/default\"}"}</code><div>{approved ? <Chip color={approved === "approved" ? "success" : "danger"}>{approved}</Chip> : <><Button size="sm" variant="secondary" onPress={() => setApproved("rejected")}>Reject</Button><Button size="sm" variant="primary" onPress={() => setApproved("approved")}>Approve</Button></>}</div></Card.Content></Card></div></article>
        <div className="chat-user-message">Show sources and file attachments.</div>
        <article className="chat-assistant"><span><Bot /></span><div><div className="chat-file"><FileText /><p><strong>dashboard-spec.json</strong><small>14 KB · JSON</small></p></div><p>The attached Spec describes a persistent sidebar, top bar, decision cards, responsive tables, and an explicit Data Adapter boundary.</p><Button size="sm" variant="ghost">3 sources<ChevronDown /></Button></div></article>
        {sentMessage ? <div className="chat-user-message">{sentMessage}</div> : null}
      </div><footer><label><textarea aria-label="Chat message" placeholder="What do you want to know?" value={message} onChange={(event) => setMessage(event.target.value)} /><div><Button isIconOnly variant="secondary" aria-label="Attach"><Paperclip /></Button><Button variant="secondary"><Bot />GPT-5.4<ChevronDown /></Button><Button isIconOnly variant="primary" aria-label="Send" isDisabled={!message.trim()} onPress={() => { setSentMessage(message.trim()); setMessage("") }}><Send /></Button></div></label><small>AI can make mistakes. Check important info.</small></footer></section>
    </main>
  )
}
