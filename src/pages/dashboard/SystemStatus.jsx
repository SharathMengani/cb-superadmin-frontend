import { useEffect, useState } from "react";
import { PageHeader, Card, Badge } from "@/components/PageChrome";
import api from "@/lib/api";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export default function SystemStatus() {
  const [d, setD] = useState(null);
  useEffect(() => { api.get("/dashboard/system-status").then(r => setD(r.data)); }, []);
  if (!d) return <div>Loading...</div>;

  const statusIcon = (s) => {
    if (s === "operational") return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    if (s === "degraded") return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    return <XCircle className="w-4 h-4 text-red-400" />;
  };
  const statusBadge = (s) => ({
    operational: <Badge variant="success">Operational</Badge>,
    degraded: <Badge variant="warning">Degraded</Badge>,
    down: <Badge variant="danger">Down</Badge>,
  }[s]);

  return (
    <div className="space-y-6" data-testid="page-system-status">
      <PageHeader title="System Status" subtitle="Health of all ChatBucket services and infrastructure." breadcrumb={["Dashboard", "System Status"]} />

      {d.incidents.length > 0 && (
        <div className="glass-card rounded-2xl p-4 border-amber-500/40 border">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div className="flex-1">
              <div className="font-medium text-sm">{d.incidents[0].title}</div>
              <div className="text-xs text-muted-foreground">Incident {d.incidents[0].id} · started {d.incidents[0].started}</div>
            </div>
            <Badge variant="warning">{d.incidents[0].severity}</Badge>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card"><div className="text-xs text-muted-foreground">Current Latency</div><div className="text-2xl font-semibold mt-1">{d.current_latency} ms</div></div>
        <div className="stat-card"><div className="text-xs text-muted-foreground">Error Rate</div><div className="text-2xl font-semibold mt-1">{d.error_rate}%</div></div>
        <div className="stat-card"><div className="text-xs text-muted-foreground">Active Incidents</div><div className="text-2xl font-semibold mt-1">{d.incidents.length}</div></div>
      </div>

      <Card title="Services Health">
        <div className="space-y-2">
          {d.services.map(s => (
            <div key={s.name} className="flex items-center justify-between py-3 border-b border-border/60 last:border-0">
              <div className="flex items-center gap-3">
                {statusIcon(s.status)}
                <div>
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-[10px] text-muted-foreground">Uptime {s.uptime}%</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-xs text-muted-foreground">Latency <span className="text-foreground mono">{s.latency}ms</span></div>
                {statusBadge(s.status)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
