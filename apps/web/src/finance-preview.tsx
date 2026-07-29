import { Button, Card, Chip } from "@heroui/react"
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowUp,
  ArrowUpRight,
  CircleHelp,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  PieChart,
  ReceiptText,
  RefreshCw,
  Send,
  Settings,
  TrendingUp,
  WalletCards,
} from "lucide-react"
import { AgenicMark } from "./components/logo"
import type { Locale } from "./i18n"
import "./finance-preview.css"

const holdings = [
  ["₿", "BTC", "Bitcoin", "$1,283.84", "+2.34%", "orange"],
  ["$", "USDC", "USD Coin", "$2,087.25", "+0.01%", "blue"],
  ["◆", "ETH", "Ethereum", "$1,087.25", "-1.12%", "gray"],
  ["⬡", "BNB", "BNB Chain", "$165.20", "+0.92%", "yellow"],
  ["≋", "SOL", "Solana", "$195.54", "+4.72%", "dark"],
]

const transactions = [
  ["0xaa2bf905d3…", "Contract Interaction", "ETH", "0.12312453 ETH", "$320.65", "Dec 8, 2025 · 12:32 PM"],
  ["0xbb4e0d712f…", "Received", "USDC", "500.00 USDC", "$500.00", "Dec 7, 2025 · 11:43 AM"],
  ["0xcc1a2f4e39…", "Sent", "ETH", "1.42 ETH", "$3,384.10", "Nov 28, 2025 · 08:14 AM"],
  ["0xdd6b5a1635…", "Swapped", "BTC", "0.1543 BTC", "$9,385.22", "Oct 5, 2025 · 06:21 PM"],
  ["0xee7c6f5410…", "Received", "SOL", "12.4 SOL", "$2,692.16", "Oct 2, 2025 · 02:12 PM"],
  ["0xff9d0a7102…", "Sent", "USDC", "850.00 USDC", "$850.00", "Sep 29, 2025 · 09:54 AM"],
]

function FinanceMetric({ label, value, change, suffix }: { label: string; value: string; change?: string; suffix?: string }) {
  return <div className="finance-metric"><span>{label}</span><div><strong>{value}</strong>{change ? <Chip size="sm"><ArrowUp />{change}</Chip> : <Chip size="sm">{suffix}</Chip>}</div></div>
}

function PortfolioChart() {
  return (
    <div className="finance-chart">
      <svg viewBox="0 0 720 190" preserveAspectRatio="none" role="img" aria-label="Portfolio balance">
        <defs><linearGradient id="finance-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b84f3" stopOpacity=".2" /><stop offset="1" stopColor="#0b84f3" stopOpacity="0" /></linearGradient></defs>
        {[28, 76, 124, 172].map((y) => <line key={y} x1="0" x2="720" y1={y} y2={y} />)}
        <path d="M0 170 C45 152 72 164 112 137 S184 151 224 120 S290 131 337 91 S412 105 454 74 S529 90 575 53 S652 67 720 23 L720 190 L0 190Z" fill="url(#finance-fill)" />
        <path d="M0 170 C45 152 72 164 112 137 S184 151 224 120 S290 131 337 91 S412 105 454 74 S529 90 575 53 S652 67 720 23" />
      </svg>
      <div>{Array.from({ length: 14 }, (_, index) => <span key={index}>Day {(index + 1) * 2}</span>)}</div>
    </div>
  )
}

export function FinancePreview({ locale }: { locale: Locale }) {
  return (
    <main className="finance-preview">
      <aside className="finance-sidebar">
        <div className="finance-profile"><AgenicMark /><div><strong>Fred Palmer</strong><span>fred@agenic.dev</span></div></div>
        <nav>
          <Button variant="primary"><LayoutDashboard />Dashboard</Button>
          <Button variant="ghost"><PieChart />Portfolio</Button>
          <Button variant="ghost"><CreditCard />Spending</Button>
          <Button variant="ghost"><ReceiptText />Transactions</Button>
          <Button variant="ghost"><TrendingUp />Earn<Chip size="sm" color="success">New</Chip></Button>
          <Button variant="ghost"><Settings />Settings</Button>
        </nav>
        <div><Button variant="ghost"><CircleHelp />Help & information</Button><Button variant="ghost"><LogOut />Log out</Button></div>
      </aside>

      <div className="finance-shell">
        <header className="finance-topbar"><div><Button isIconOnly variant="ghost" className="finance-menu" aria-label="Menu"><Menu /></Button><h1>{locale === "zh" ? "下午好，Fred" : "Good afternoon, Fred"}</h1></div><div><Button variant="secondary"><RefreshCw />Swap</Button><Button variant="secondary"><ArrowDownToLine />Receive</Button><Button variant="primary"><Send />Send</Button></div></header>
        <div className="finance-content">
          <section className="finance-metrics"><FinanceMetric label="Total balance" value="$5,427.48" change="5.32%" /><FinanceMetric label="24h change" value="$120.18" change="2.24%" /><FinanceMetric label="Top performer · SOL" value="4.72" change="4.72%" /><FinanceMetric label="Holdings" value="8" suffix="Assets" /></section>
          <section className="finance-main-grid">
            <Card className="finance-portfolio">
              <Card.Header><Card.Title>Portfolio</Card.Title><div>{["1D", "1W", "1M", "3M", "1Y", "All"].map((period) => <Button key={period} size="sm" variant={period === "1M" ? "primary" : "ghost"}>{period}</Button>)}</div></Card.Header>
              <Card.Content><span>Total balance</span><strong>$5,427.48</strong><small className="finance-change"><ArrowUp />+8.16% <em>1M</em></small><PortfolioChart /></Card.Content>
            </Card>
            <section className="finance-holdings"><h2>Holdings <Chip size="sm">8</Chip></h2>{holdings.map(([symbol, code, name, value, change, tone]) => <div key={code}><span className={`finance-coin is-${tone}`}>{symbol}</span><p><strong>{code}</strong><small>{name}</small></p><i className={change.startsWith("-") ? "is-down" : ""}>⌁⌁</i><p><strong>{value}</strong><small className={change.startsWith("-") ? "is-negative" : "is-positive"}>{change.startsWith("-") ? <ArrowDown /> : <ArrowUp />}{change}</small></p></div>)}<Button fullWidth variant="secondary">See all holdings</Button></section>
          </section>
          <section className="finance-activity"><h2>Recent activity <Chip size="sm">8</Chip></h2><div><table><thead><tr><th>Txn #</th><th>Type</th><th>Asset</th><th>Value</th><th>Date</th></tr></thead><tbody>{transactions.map(([id, type, asset, amount, fiat, date]) => <tr key={id}><td>{id}<ArrowUpRight /></td><td><Chip size="sm">{type}</Chip></td><td><b>{asset}</b></td><td><strong>{amount}</strong><small>{fiat}</small></td><td>{date}</td></tr>)}</tbody></table></div></section>
        </div>
      </div>
    </main>
  )
}
