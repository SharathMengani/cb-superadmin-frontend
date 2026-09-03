import { useEffect, useState } from "react";
import { PageHeader, Card, Badge } from "@/components/PageChrome";
import api from "@/lib/api";
import { Database, Play, Download, Trash2, Sparkles, Check, X } from "lucide-react";

export function CustomRetention() {
  const [data, setData] = useState([]);
  useEffect(() => { api.get("/observability/retention").then(r => setData(r.data)); }, []);

  return (
    <div className="space-y-6" data-testid="page-custom-retention">
      <PageHeader title="Custom Retention" subtitle="Per-customer retention policies for audio, chat and API logs." breadcrumb={["Observability", "Custom Retention"]} />
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Customer", "Audio Retention", "Chat Retention", "Log Retention", "Storage (GB)", "Custom Policy", ""].map(c => (
                <th key={c} className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i} className="border-b border-border/60 table-row-hover">
                <td className="px-4 py-3 font-medium text-xs">{r.customer}</td>
                <td className="px-4 py-3 text-xs">{r.audio_retention}</td>
                <td className="px-4 py-3 text-xs">{r.chat_retention}</td>
                <td className="px-4 py-3 text-xs">{r.log_retention}</td>
                <td className="px-4 py-3 mono text-xs">{r.audio_storage_gb}</td>
                <td className="px-4 py-3">
                  {r.custom ? <Badge variant="info">Custom</Badge> : <Badge variant="neutral">Default</Badge>}
                </td>
                <td className="px-4 py-3"><button className="text-xs text-primary-foreground">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ObservabilityPlans() {
  const [plans, setPlans] = useState([]);
  useEffect(() => { api.get("/observability/plans").then(r => setPlans(r.data)); }, []);

  return (
    <div className="space-y-6" data-testid="page-observability-plans">
      <PageHeader
        title="Observability Plans"
        subtitle="Paid add-on for enterprise-grade session replay, exports and long-term retention."
        breadcrumb={["Observability", "Plans"]}
        actions={<button className="h-9 px-4 rounded-lg btn-gradient text-xs">Add New Plan</button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p, i) => {
          const featured = p.name === "Pro";
          return (
            <div key={p.id} className={`glass-card rounded-2xl p-6 ${featured ? "glow-primary border-primary/40" : ""}`}>
              {featured && <Badge variant="info"><Sparkles className="w-3 h-3" /> Most Popular</Badge>}
              <div className="mt-3 text-lg font-semibold">{p.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-semibold">₹{p.monthly.toLocaleString("en-IN")}</span>
                <span className="text-xs text-muted-foreground">/ month</span>
              </div>
              <div className="mt-4 space-y-2 text-xs">
                {[
                  ["Retention", `${p.retention_days} days`],
                  ["Audio Storage", p.audio_storage],
                  ["Session Replay", p.session_replay],
                  ["Export Access", p.export],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{k}</span>
                    {typeof v === "boolean"
                      ? (v ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-muted-foreground" />)
                      : <span className="font-medium">{v}</span>}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Active customers</span>
                <Badge variant={featured ? "info" : "neutral"}>{p.customers}</Badge>
              </div>
              <button className={`w-full mt-4 h-9 rounded-lg text-xs font-medium ${featured ? "btn-gradient" : "bg-secondary border border-border"}`}>Edit Plan</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AudioStorage() {
  const [d, setD] = useState(null);
  useEffect(() => { api.get("/observability/audio-storage").then(r => setD(r.data)); }, []);
  if (!d) return <div>Loading...</div>;

  return (
    <div className="space-y-6" data-testid="page-audio-storage">
      <PageHeader title="Audio Storage" subtitle="Input and output audio files across all customers." breadcrumb={["Observability", "Audio Storage"]} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ["Total Storage", d.total_gb + " GB"],
          ["Input Audio", d.input_gb + " GB"],
          ["Output Audio", d.output_gb + " GB"],
          ["Monthly Cost", "₹" + d.monthly_cost.toLocaleString("en-IN")],
        ].map(([k, v]) => (
          <div key={k} className="stat-card">
            <Database className="w-5 h-5 text-primary-foreground mb-2" />
            <div className="text-xs text-muted-foreground">{k}</div>
            <div className="text-xl font-semibold mt-0.5">{v}</div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["File ID", "Customer", "Type", "Duration", "Size", "Retention", "Created", ""].map(c => (
                <th key={c} className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.files.map((f, i) => (
              <tr key={i} className="border-b border-border/60 table-row-hover">
                <td className="px-4 py-3 mono text-xs text-primary-foreground">{f.id}</td>
                <td className="px-4 py-3 text-xs">{f.customer}</td>
                <td className="px-4 py-3"><Badge variant={f.type === "input" ? "info" : "success"}>{f.type}</Badge></td>
                <td className="px-4 py-3 mono text-xs">{f.duration}</td>
                <td className="px-4 py-3 mono text-xs">{f.size_mb} MB</td>
                <td className="px-4 py-3 text-xs">{f.retention_days} days</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{f.created}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button className="w-7 h-7 rounded bg-secondary hover:btn-gradient flex items-center justify-center"><Play className="w-3 h-3" /></button>
                  <button className="w-7 h-7 rounded bg-secondary hover:btn-gradient flex items-center justify-center"><Download className="w-3 h-3" /></button>
                  <button className="w-7 h-7 rounded bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center"><Trash2 className="w-3 h-3" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
