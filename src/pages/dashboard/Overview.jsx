import { useEffect, useState } from "react";
import { PageHeader, StatCard, Card, Badge } from "@/components/PageChrome";
import api from "@/lib/api";
import {
  IndianRupee, Users, Zap, CheckCircle2, KeyRound, ShoppingBag, UserPlus, TrendingUp,
  Mic, Ear, Languages, MessageSquare, ArrowUpRight, Plus, Ticket, Megaphone, FileText, BarChart3
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line
} from "recharts";

const hourly = Array.from({ length: 13 }, (_, i) => ({
  time: `${i * 2}${i < 6 ? "AM" : "PM"}`,
  value: Math.round(20000 + Math.sin(i / 2) * 30000 + Math.random() * 20000 + i * 3000),
}));

const services = [
  { key: "paluku", name: "CB Paluku", sub: "Text to Speech", icon: Mic, color: "text-purple-400", bg: "bg-purple-500/15", requests: "128.4K", change: 16.3, spark: [30, 42, 38, 55, 48, 60, 65, 70, 62, 78, 82, 75] },
  { key: "vinu", name: "CB Vinu", sub: "Speech to Text", icon: Ear, color: "text-amber-400", bg: "bg-amber-500/15", requests: "96.7K", change: 13.1, spark: [45, 40, 55, 50, 62, 58, 70, 65, 78, 72, 85, 80] },
  { key: "vaaradhi", name: "CB Vaaradhi", sub: "Translation", icon: Languages, color: "text-cyan-400", bg: "bg-cyan-500/15", requests: "76.5K", change: 11.4, spark: [25, 35, 30, 42, 45, 52, 48, 60, 58, 65, 62, 72] },
  { key: "thodu", name: "CB Thodu", sub: "Chat + Voice Agent", icon: MessageSquare, color: "text-pink-400", bg: "bg-pink-500/15", requests: "42.1K", change: 9.2, spark: [20, 28, 32, 25, 40, 42, 38, 50, 45, 55, 52, 60] },
];

const topCustomers = [
  { name: "TechNova Solutions", requests: "128.4K", spend: "₹48,250.00" },
  { name: "Voxify AI Pvt Ltd", requests: "96.2K", spend: "₹36,120.50" },
  { name: "InnoTalk Systems", requests: "72.8K", spend: "₹28,450.75" },
  { name: "LinguaVerse", requests: "54.3K", spend: "₹21,890.20" },
  { name: "Speakr Labs", requests: "41.1K", spend: "₹16,780.60" },
];

const signups = [
  { name: "AI Voice Studio", email: "ai.voice@studio.com", plan: "Pro" },
  { name: "Global TransTech", email: "hello@globaltranstech.com", plan: "Enterprise" },
  { name: "ChatterWise", email: "info@chatterwise.ai", plan: "Starter" },
  { name: "LinguaNext", email: "contact@linguanext.com", plan: "Pro" },
  { name: "VoiceGen Labs", email: "admin@voicegenlabs.com", plan: "Enterprise" },
];

const alerts = [
  { icon: "🔴", title: "High Error Rate", desc: "Error rate is above 5% for CB Vinu", time: "2 mins ago", tone: "danger" },
  { icon: "🟡", title: "High Latency", desc: "Average latency is high for CB Paluku", time: "12 mins ago", tone: "warning" },
  { icon: "🟠", title: "Low Credits", desc: "5 customers have low balance", time: "18 mins ago", tone: "warning" },
  { icon: "🔵", title: "Scheduled Maintenance", desc: "System maintenance on May 14, 02:00 AM IST", time: "1 day ago", tone: "info" },
];

const Sparkline = ({ data, color }) => (
  <ResponsiveContainer width={120} height={38}>
    <LineChart data={data.map((v, i) => ({ i, v }))}>
      <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

export default function Overview() {
  const [d, setD] = useState(null);

  useEffect(() => {
    api.get("/dashboard/overview").then(r => setD(r.data)).catch(() => {});
  }, []);

  const fmt = (n) => n?.toLocaleString("en-IN");

  return (
    <div className="space-y-6" data-testid="dashboard-overview">
      <PageHeader
        title="Executive Dashboard"
        subtitle="Real-time overview of platform performance and business metrics"
      />

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard icon={IndianRupee} label="Today's Revenue" value={`₹${fmt(Math.round(d?.today_revenue || 128450))}`} change={d?.revenue_change || 18.6} iconBg="bg-purple-500/15" iconColor="text-purple-400" />
        <StatCard icon={Users} label="Active Customers" value={fmt(d?.active_customers || 2843)} change={d?.customers_change || 12.4} iconBg="bg-cyan-500/15" iconColor="text-cyan-400" />
        <StatCard icon={Zap} label="API Requests" value={`${((d?.total_api_requests || 532100) / 1000).toFixed(1)}K`} change={d?.requests_change || 14.2} iconBg="bg-blue-500/15" iconColor="text-blue-400" />
        <StatCard icon={CheckCircle2} label="Successful" value={`${(((d?.successful_requests || 525200) / (d?.total_api_requests || 532100)) * 100).toFixed(2)}%`} change={1.2} iconBg="bg-emerald-500/15" iconColor="text-emerald-400" />
        <StatCard icon={KeyRound} label="Active API Keys" value={fmt(d?.active_api_keys || 4586)} change={8.7} iconBg="bg-indigo-500/15" iconColor="text-indigo-400" />
        <StatCard icon={ShoppingBag} label="Credits Sold" value={`₹${fmt(d?.credits_sold || 345890)}`} change={21.3} iconBg="bg-orange-500/15" iconColor="text-orange-400" />
        <StatCard icon={UserPlus} label="New Signups" value={fmt(d?.new_registrations || 312)} change={-8.5} changeType="down" iconBg="bg-pink-500/15" iconColor="text-pink-400" />
      </div>

      {/* Service usage + Requests chart + Live Services */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <Card title="Service Usage Overview" className="xl:col-span-5">
          <div className="space-y-4">
            {services.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.key} className="flex items-center gap-4 group">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">({s.sub})</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{s.requests}</div>
                    <div className="text-[11px] text-muted-foreground">Requests</div>
                  </div>
                  <div className="text-emerald-400 text-xs w-14">↑ {s.change}%</div>
                  <Sparkline data={s.spark} color={`hsl(var(--chart-${{paluku:1,vinu:4,vaaradhi:2,thodu:5}[s.key]}))`} />
                </div>
              );
            })}
            <a href="/platform/api" className="block text-center text-xs text-primary-foreground hover:text-primary pt-2 border-t border-border">View all services analytics →</a>
          </div>
        </Card>

        <Card title="Requests Over Time" className="xl:col-span-4" action={
          <div className="flex items-center gap-1 text-xs">
            {["1H", "6H", "12H", "24H"].map(x => (
              <button key={x} className={`px-2 py-1 rounded ${x === "24H" ? "bg-primary/20 text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{x}</button>
            ))}
          </div>
        }>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourly}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(262 83% 62%)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(262 83% 62%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 14%)" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: "hsl(240 5% 55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(240 5% 55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(240 14% 8%)", border: "1px solid hsl(240 12% 14%)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="value" stroke="hsl(262 83% 62%)" strokeWidth={2} fill="url(#grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Live Services Status" className="xl:col-span-3">
          <div className="space-y-3">
            {[
              { name: "CB Paluku" }, { name: "CB Vinu" }, { name: "CB Vaaradhi" },
              { name: "CB Thodu" }, { name: "API Gateway" }, { name: "Web Dashboard" },
            ].map(s => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary/60 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
                  </div>
                  <div>
                    <div className="text-xs font-medium">{s.name}</div>
                    <div className="text-[10px] text-muted-foreground">Operational</div>
                  </div>
                </div>
                <Badge variant="success">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Operational
                </Badge>
              </div>
            ))}
            <a href="/dashboard/status" className="block text-center text-xs text-primary-foreground pt-2 border-t border-border">View System Status →</a>
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <Card title="Top 5 Customers by Usage" className="xl:col-span-1">
          <div className="space-y-3">
            <div className="grid grid-cols-3 text-[10px] text-muted-foreground uppercase tracking-wider pb-2 border-b border-border">
              <span>Customer</span><span>Requests</span><span className="text-right">Spend</span>
            </div>
            {topCustomers.map((c, i) => (
              <div key={i} className="grid grid-cols-3 items-center text-xs">
                <span className="truncate">{c.name}</span>
                <span className="text-muted-foreground">{c.requests}</span>
                <span className="text-right font-medium">{c.spend}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Signups" action={<a href="/customers/all" className="text-xs text-primary-foreground">View all →</a>}>
          <div className="space-y-3">
            {signups.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md btn-gradient flex items-center justify-center text-[10px] font-semibold text-white">
                  {s.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{s.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{s.email}</div>
                </div>
                <Badge variant={s.plan === "Enterprise" ? "info" : s.plan === "Pro" ? "success" : "neutral"}>{s.plan}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Key Alerts" action={<a href="#" className="text-xs text-primary-foreground">View all →</a>}>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                  a.tone === "danger" ? "bg-red-500/15" : a.tone === "warning" ? "bg-amber-500/15" : "bg-blue-500/15"
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    a.tone === "danger" ? "bg-red-400" : a.tone === "warning" ? "bg-amber-400" : "bg-blue-400"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium">{a.title}</div>
                  <div className="text-[10px] text-muted-foreground line-clamp-2">{a.desc}</div>
                </div>
                <span className="text-[9px] text-muted-foreground whitespace-nowrap">{a.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Plus, label: "Add Credits" },
              { icon: Ticket, label: "Create Coupon" },
              { icon: Megaphone, label: "Broadcast" },
              { icon: FileText, label: "Add Announcement" },
              { icon: BarChart3, label: "Logs Explorer" },
              { icon: TrendingUp, label: "System Status" },
            ].map((a, i) => {
              const Icon = a.icon;
              return (
                <button key={i} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-secondary/40 border border-border hover:bg-secondary hover:border-primary/40 transition-all" data-testid={`quick-action-${a.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="w-9 h-9 rounded-md btn-gradient flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] text-center leading-tight">{a.label}</span>
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
