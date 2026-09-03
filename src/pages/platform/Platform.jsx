import { useEffect, useState } from "react";
import GenericPage from "@/pages/GenericPage";
import { Badge, PageHeader, Card } from "@/components/PageChrome";
import api from "@/lib/api";
import { Mic, Ear, Languages, MessageSquare } from "lucide-react";

export function ApiManagement() {
  const [keys, setKeys] = useState([]);
  useEffect(() => { api.get("/api-keys").then(r => setKeys(r.data)); }, []);
  return (
    <GenericPage
      title="API Management"
      subtitle="Every customer API key, rate limits, IPs and usage."
      breadcrumb={["Platform", "API Management"]}
      showAdd cta="Create API Key"
      stats={[
        { label: "Total Keys", value: keys.length || 18 },
        { label: "Active", value: keys.filter(k => k.status === "active").length || 15 },
        { label: "Revoked", value: keys.filter(k => k.status === "revoked").length || 3 },
        { label: "Expired", value: 0 },
      ]}
      columns={["Key Name", "Customer", "Environment", "Status", "Last Used", "Requests"]}
      rows={keys.slice(0, 20).map(k => [
        <span>{k.name}<div className="text-[10px] text-muted-foreground mono">{k.id}</div></span>,
        k.customer,
        <Badge variant={k.environment === "Production" ? "danger" : "info"}>{k.environment}</Badge>,
        <Badge variant={k.status === "active" ? "success" : "neutral"}>{k.status}</Badge>,
        <span className="text-muted-foreground">{k.last_used}</span>,
        <span className="mono">{k.requests.toLocaleString("en-IN")}</span>,
      ])}
      filters={["All Environments", "All Status"]}
    />
  );
}

function ServicePage({ service, icon: Icon, color, bg }) {
  const [d, setD] = useState(null);
  useEffect(() => { api.get(`/services/${service}`).then(r => setD(r.data)); }, [service]);
  if (!d) return <div>Loading...</div>;
  const entries = Object.entries(d).filter(([k]) => !["name", "type"].includes(k));
  return (
    <div className="space-y-6" data-testid={`page-${service}`}>
      <PageHeader
        title={d.name}
        subtitle={d.type + " service overview and configuration."}
        breadcrumb={["Platform", d.name]}
      />
      <div className="glass-card rounded-2xl p-6 flex items-center gap-5">
        <div className={`w-16 h-16 rounded-2xl ${bg} flex items-center justify-center`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
        <div className="flex-1">
          <div className="text-lg font-semibold">{d.name}</div>
          <div className="text-sm text-muted-foreground">{d.type} — production ready</div>
        </div>
        <Badge variant="success">Operational</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {entries.map(([k, v]) => (
          <div key={k} className="stat-card">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{k.replace(/_/g, " ")}</div>
            <div className="text-2xl font-semibold mt-1">{typeof v === "number" ? v.toLocaleString("en-IN") : v}</div>
          </div>
        ))}
      </div>

      <Card title="Configuration">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {[
            ["Model Version", "v2.3.1"],
            ["Rollout %", "100%"],
            ["Enable/Disable", <Badge variant="success">Enabled</Badge>],
            ["Rate Limit", "1000 req/min"],
            ["Max Duration", "300s"],
            ["Storage Retention", "30 days"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-border/60">
              <span className="text-muted-foreground">{k}</span>
              <span className="font-medium">{v}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export const Paluku = () => <ServicePage service="paluku" icon={Mic} color="text-purple-400" bg="bg-purple-500/15" />;
export const Vinu = () => <ServicePage service="vinu" icon={Ear} color="text-amber-400" bg="bg-amber-500/15" />;
export const Vaaradhi = () => <ServicePage service="vaaradhi" icon={Languages} color="text-cyan-400" bg="bg-cyan-500/15" />;
export const Thodu = () => <ServicePage service="thodu" icon={MessageSquare} color="text-pink-400" bg="bg-pink-500/15" />;

export function VoiceLibrary() {
  const [voices, setVoices] = useState([]);
  useEffect(() => { api.get("/voices").then(r => setVoices(r.data)); }, []);
  return (
    <GenericPage
      title="Voice Library"
      subtitle="Every voice available on ChatBucket Paluku."
      breadcrumb={["Platform", "Voice Library"]}
      showAdd cta="Add Voice"
      columns={["Voice", "Language", "Gender", "Style", "Status", "Usage"]}
      rows={voices.map(v => [
        <span className="font-medium">{v.name}</span>,
        v.language, v.gender, v.style,
        <Badge variant={v.status === "active" ? "success" : "warning"}>{v.status}</Badge>,
        <span className="mono">{v.usage.toLocaleString("en-IN")}</span>,
      ])}
    />
  );
}

export function LanguagesPage() {
  const [langs, setLangs] = useState([]);
  useEffect(() => { api.get("/languages").then(r => setLangs(r.data)); }, []);
  return (
    <GenericPage
      title="Languages"
      subtitle="Manage supported languages, scripts, quality and rollout status."
      breadcrumb={["Platform", "Languages"]}
      columns={["Code", "Language", "Status", "Native Script", "Roman", "Quality"]}
      rows={langs.map(l => [
        <span className="mono uppercase">{l.code}</span>,
        <span className="font-medium">{l.name}</span>,
        <Badge variant={l.status === "active" ? "success" : l.status === "beta" ? "warning" : "neutral"}>{l.status}</Badge>,
        l.native_script ? "✓" : "—",
        l.roman ? "✓" : "—",
        <span className="mono">{l.quality}%</span>,
      ])}
    />
  );
}
