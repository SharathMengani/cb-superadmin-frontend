import { useEffect, useState } from "react";
import { PageHeader, Card, Badge } from "@/components/PageChrome";
import api from "@/lib/api";
import {
  Shield, Ban, AlertTriangle, Cpu, Thermometer, Zap, Server, Calendar,
  Bell as BellIcon, Webhook, PlayCircle, PauseCircle, RefreshCw, XCircle, CheckCircle2, Plus
} from "lucide-react";

export function FraudAutoActions() {
  const [rules, setRules] = useState([]);
  useEffect(() => { api.get("/fraud/rules").then(r => setRules(r.data)); }, []);

  const actionBadge = (a) => {
    const map = { auto_flag: "warning", throttle: "info", rate_limit: "info", manual_review: "warning", block_and_notify: "danger", block_ip: "danger" };
    return <Badge variant={map[a] || "neutral"}>{a.replace(/_/g, " ")}</Badge>;
  };

  return (
    <div className="space-y-6" data-testid="page-fraud-actions">
      <PageHeader
        title="Fraud Auto-Actions"
        subtitle="Rules engine for detecting and responding to fraudulent activity."
        breadcrumb={["Security", "Fraud Auto-Actions"]}
        actions={<button className="h-9 px-4 rounded-lg btn-gradient text-xs flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> New Rule</button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          [Ban, "Blocked (24h)", 42, "text-red-400", "bg-red-500/15"],
          [AlertTriangle, "Flagged (24h)", 128, "text-amber-400", "bg-amber-500/15"],
          [Shield, "Active Rules", rules.length || 6, "text-purple-400", "bg-purple-500/15"],
          [CheckCircle2, "Safe Events", "1.2M", "text-emerald-400", "bg-emerald-500/15"],
        ].map(([Icon, label, val, color, bg]) => (
          <div key={label} className="stat-card">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-2xl font-semibold mt-0.5">{val}</div>
          </div>
        ))}
      </div>

      <Card title="Automation Rules" subtitle="Rules run continuously against every request">
        <div className="space-y-2">
          {rules.map(r => (
            <div key={r.id} className="p-4 rounded-xl bg-secondary/40 border border-border hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{r.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {actionBadge(r.action)}
                  <button className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center">
                    <PauseCircle className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-6 mt-3 pt-3 border-t border-border/60 text-xs">
                <div><span className="text-muted-foreground">Triggers (24h): </span><span className="mono font-medium">{r.trigger_count_24h}</span></div>
                <div><span className="text-muted-foreground">Risk threshold: </span><Badge variant="warning">{r.risk_threshold}</Badge></div>
                <div className="ml-auto"><Badge variant="success">{r.status}</Badge></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function GpuMonitoring() {
  const [gpus, setGpus] = useState([]);
  useEffect(() => {
    const load = () => api.get("/infrastructure/gpu").then(r => setGpus(r.data));
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, []);

  const totalUtil = gpus.length ? Math.round(gpus.reduce((s, g) => s + g.utilization, 0) / gpus.length) : 0;
  const hotCount = gpus.filter(g => g.status === "hot").length;
  const totalCost = gpus.reduce((s, g) => s + g.hourly_cost, 0).toFixed(2);

  return (
    <div className="space-y-6" data-testid="page-gpu-monitoring">
      <PageHeader
        title="GPU Monitoring"
        subtitle="Real-time GPU utilization, memory, temperature and cost across the fleet."
        breadcrumb={["System", "GPU Monitoring"]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          [Cpu, "Total GPUs", gpus.length, "text-purple-400", "bg-purple-500/15"],
          [Zap, "Avg Utilization", totalUtil + "%", "text-cyan-400", "bg-cyan-500/15"],
          [Thermometer, "Hot GPUs", hotCount, "text-red-400", "bg-red-500/15"],
          [Server, "Hourly Cost", "$" + totalCost, "text-emerald-400", "bg-emerald-500/15"],
        ].map(([Icon, label, val, color, bg]) => (
          <div key={label} className="stat-card">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-2xl font-semibold mt-0.5">{val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gpus.map(g => (
          <div key={g.id} className="glass-card rounded-2xl p-4 hover:border-primary/40 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-medium text-sm mono">{g.id}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{g.type}</div>
              </div>
              <Badge variant={g.status === "healthy" ? "success" : "danger"}>{g.status}</Badge>
            </div>

            {/* Utilization ring */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                  <circle cx="20" cy="20" r="18" fill="none" stroke="hsl(240 12% 14%)" strokeWidth="3" />
                  <circle cx="20" cy="20" r="18" fill="none"
                    stroke={g.utilization > 85 ? "hsl(0 72% 51%)" : g.utilization > 70 ? "hsl(38 92% 50%)" : "hsl(262 83% 62%)"}
                    strokeWidth="3" strokeDasharray={`${(g.utilization / 100) * 113} 113`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-lg font-semibold">{g.utilization}%</div>
                  <div className="text-[9px] text-muted-foreground">Util</div>
                </div>
              </div>

              <div className="flex-1 space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Memory</span><span className="mono">{g.memory_used_gb}/{g.memory_total_gb} GB</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Temp</span><span className={`mono ${g.temperature_c > 75 ? "text-red-400" : g.temperature_c > 65 ? "text-amber-400" : "text-emerald-400"}`}>{g.temperature_c}°C</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="mono">{g.active_model}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Queue</span><span className="mono">{g.queue_size}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Cost</span><span className="mono">${g.hourly_cost}/hr</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MaintenanceScheduler() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/incidents/maintenance").then(r => setItems(r.data)); }, []);

  return (
    <div className="space-y-6" data-testid="page-maintenance">
      <PageHeader
        title="Maintenance Scheduler"
        subtitle="Plan, schedule and notify customers about upcoming maintenance."
        breadcrumb={["System", "Maintenance"]}
        actions={<button className="h-9 px-4 rounded-lg btn-gradient text-xs flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Schedule Maintenance</button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          [Calendar, "Scheduled", items.filter(i => i.status === "scheduled").length],
          [PlayCircle, "In Progress", 0],
          [CheckCircle2, "Completed (30d)", items.filter(i => i.status === "completed").length],
          [BellIcon, "Customer Notified", items.filter(i => i.notification_sent).length],
        ].map(([Icon, label, val]) => (
          <div key={label} className="stat-card">
            <Icon className="w-5 h-5 text-primary-foreground mb-2" />
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-2xl font-semibold mt-0.5">{val}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {items.map(m => (
          <div key={m.id} className={`glass-card rounded-2xl p-5 border ${m.status === "scheduled" ? "border-amber-500/30" : "border-border"}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.status === "scheduled" ? "bg-amber-500/15 text-amber-400" : "bg-emerald-500/15 text-emerald-400"}`}>
                  {m.status === "scheduled" ? <Calendar className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-medium text-sm">{m.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 mono">{m.id}</div>
                </div>
              </div>
              <Badge variant={m.status === "scheduled" ? "warning" : "success"}>{m.status}</Badge>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div><div className="text-muted-foreground mb-0.5">Starts</div><div className="font-medium">{m.starts}</div></div>
              <div><div className="text-muted-foreground mb-0.5">Ends</div><div className="font-medium">{m.ends}</div></div>
              <div>
                <div className="text-muted-foreground mb-0.5">Affected Services</div>
                <div className="flex flex-wrap gap-1">{m.affected.map(a => <Badge key={a} variant="info">{a}</Badge>)}</div>
              </div>
              <div><div className="text-muted-foreground mb-0.5">Impact</div><div className="font-medium">{m.impact}</div></div>
            </div>

            {m.status === "scheduled" && (
              <div className="mt-3 pt-3 border-t border-border/60 flex items-center gap-2">
                <button className="h-8 px-3 rounded-lg bg-secondary border border-border text-xs">Edit</button>
                <button className="h-8 px-3 rounded-lg bg-secondary border border-border text-xs">Reschedule</button>
                <button className="h-8 px-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">Cancel</button>
                <div className="ml-auto text-[11px] text-muted-foreground flex items-center gap-1.5">
                  {m.notification_sent ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3" />}
                  Customer notification {m.notification_sent ? "sent" : "pending"}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function WebhooksAndJobs() {
  const [d, setD] = useState(null);
  useEffect(() => { api.get("/webhooks").then(r => setD(r.data)); }, []);
  if (!d) return <div>Loading...</div>;

  return (
    <div className="space-y-6" data-testid="page-webhooks">
      <PageHeader
        title="Webhooks & Background Jobs"
        subtitle="Deliveries, retries, payloads and worker health."
        breadcrumb={["System", "Webhooks & Jobs"]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          [Webhook, "Deliveries (24h)", d.deliveries.length + "×1000"],
          [CheckCircle2, "Success Rate", "94.2%"],
          [RefreshCw, "Active Jobs", d.jobs.filter(j => j.status === "running").length],
          [XCircle, "Failed Jobs", d.jobs.filter(j => j.status === "failed").length],
        ].map(([Icon, label, val]) => (
          <div key={label} className="stat-card">
            <Icon className="w-5 h-5 text-primary-foreground mb-2" />
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-2xl font-semibold mt-0.5">{val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Recent Webhook Deliveries">
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {d.deliveries.slice(0, 15).map(w => (
              <div key={w.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 text-xs">
                <Badge variant={w.status === 200 ? "success" : w.status >= 500 ? "danger" : "warning"}>{w.status}</Badge>
                <div className="flex-1 min-w-0">
                  <div className="font-medium mono">{w.event}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{w.url}</div>
                </div>
                <div className="text-right">
                  <div className="mono text-[11px]">{w.duration_ms}ms</div>
                  <div className="text-[10px] text-muted-foreground">×{w.attempts} · {w.ts}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Background Jobs">
          <div className="space-y-3">
            {d.jobs.map(j => (
              <div key={j.id} className="p-3 rounded-lg bg-secondary/40 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xs font-medium">{j.name}</div>
                    <div className="text-[10px] text-muted-foreground mono">{j.id}</div>
                  </div>
                  <Badge variant={j.status === "completed" ? "success" : j.status === "running" ? "info" : "danger"}>{j.status}</Badge>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full ${j.status === "failed" ? "bg-red-500" : "btn-gradient"}`} style={{ width: `${j.progress}%` }} />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                  <span>{j.progress}%</span>
                  <span>Started {j.started}</span>
                </div>
                {j.error && <div className="mt-2 text-[10px] text-red-400 bg-red-500/10 border border-red-500/30 rounded px-2 py-1">{j.error}</div>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
