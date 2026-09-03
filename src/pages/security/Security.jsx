import { useEffect, useState } from "react";
import GenericPage from "@/pages/GenericPage";
import { Badge, PageHeader } from "@/components/PageChrome";
import api from "@/lib/api";

const rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const SecurityDashboard = () => (
  <GenericPage
    title="Security Dashboard"
    subtitle="Suspicious logins, failed auth, blocked IPs and rate-limit violations."
    breadcrumb={["Security", "Dashboard"]}
    stats={[
      { label: "Suspicious Logins", value: 24, change: -12 },
      { label: "Failed Auth (24h)", value: 128, change: -8 },
      { label: "Blocked IPs", value: 42 },
      { label: "Rate-limit Hits", value: 342, change: 5 },
    ]}
    columns={["Time", "Event", "IP", "Location", "User", "Action"]}
    rows={[
      ["2m ago", "Failed login (5x)", <span className="mono">45.128.22.14</span>, "Unknown", "attempts on multiple", <Badge variant="danger">Auto-blocked</Badge>],
      ["12m ago", "Suspicious API pattern", <span className="mono">203.192.24.8</span>, "Mumbai, IN", "TechNova", <Badge variant="warning">Flagged</Badge>],
      ["1h ago", "Rate limit exceeded", <span className="mono">192.168.1.24</span>, "Hyderabad, IN", "Voxify AI", <Badge variant="info">Throttled</Badge>],
      ["3h ago", "New device login", <span className="mono">122.180.15.4</span>, "Bengaluru, IN", "Global TransTech", <Badge variant="success">Verified</Badge>],
    ]}
  />
);

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [q, setQ] = useState("");
  useEffect(() => {
    api.get("/security/audit-logs", { params: { action: q, limit: 100 } }).then(r => setLogs(r.data));
  }, [q]);

  const actionBadge = (a) => {
    if (a.startsWith("credit")) return <Badge variant="info">{a}</Badge>;
    if (a.startsWith("plan")) return <Badge variant="info">{a}</Badge>;
    if (a.startsWith("billing.refund")) return <Badge variant="warning">{a}</Badge>;
    if (a.startsWith("customer.suspend") || a.startsWith("customer.block") || a.startsWith("customer.delete")) return <Badge variant="danger">{a}</Badge>;
    if (a.startsWith("customer.activate")) return <Badge variant="success">{a}</Badge>;
    return <Badge variant="neutral">{a}</Badge>;
  };

  const formatVal = (v) => {
    if (v === null || v === undefined) return "—";
    if (typeof v === "object") return <span className="mono text-[10px]">{JSON.stringify(v)}</span>;
    return String(v);
  };

  return (
    <div className="space-y-6" data-testid="page-audit-logs">
      <PageHeader title="Audit Logs" subtitle="Every admin action with before/after values — captured via @audit dependency." breadcrumb={["Security", "Audit Logs"]} />

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Filter by action (e.g. credit, plan, refund, customer.suspend)"
            className="flex-1 h-9 px-3 rounded-lg bg-secondary/60 border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
            data-testid="audit-search"
          />
          <div className="text-xs text-muted-foreground">{logs.length} entries</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Time", "Admin", "Action", "Target", "Before", "After", "IP"].map(c => (
                  <th key={c} className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-border/60 table-row-hover">
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium">{l.admin_name}</div>
                    <div className="text-[10px] text-muted-foreground">{l.admin_email}</div>
                  </td>
                  <td className="px-4 py-3">{actionBadge(l.action)}</td>
                  <td className="px-4 py-3 text-xs">{l.target}</td>
                  <td className="px-4 py-3 text-xs">{formatVal(l.before)}</td>
                  <td className="px-4 py-3 text-xs">{formatVal(l.after)}</td>
                  <td className="px-4 py-3 mono text-[11px] text-muted-foreground">{l.ip}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-16 text-center text-xs text-muted-foreground">No audit log entries match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const DataRetention = () => (
  <GenericPage
    title="Data Retention"
    subtitle="Audio, chat and log retention policies per customer."
    breadcrumb={["Security", "Data Retention"]}
    cards={[
      { title: "Audio Recordings", subtitle: "Default: Do not store", description: "Applied globally unless customer opts in. Customer can choose 24h to 365 days.", footer: <div className="flex justify-between"><span className="text-muted-foreground">Active policies</span><span>12</span></div> },
      { title: "Chat Transcripts", subtitle: "Default: 30 days", description: "Sensitive fields automatically redacted before storage.", footer: <div className="flex justify-between"><span className="text-muted-foreground">Storage</span><span>4.2 TB</span></div> },
      { title: "API Logs", subtitle: "Default: 90 days", description: "Configurable per plan. Enterprise supports 365 days retention.", footer: <div className="flex justify-between"><span className="text-muted-foreground">Records</span><span>128M</span></div> },
    ]}
  />
);

export const DataRequests = () => (
  <GenericPage
    title="Data Requests"
    subtitle="Export, deletion and consent withdrawal requests."
    breadcrumb={["Security", "Data Requests"]}
    columns={["Request ID", "Customer", "Type", "Status", "Requested", "Approved by"]}
    rows={[
      [<span className="mono">DR-2091</span>, "TechNova Solutions", "Full Export", <Badge variant="success">Completed</Badge>, "2 days ago", "Priya Sharma"],
      [<span className="mono">DR-2088</span>, "LinguaVerse", "Delete Account", <Badge variant="warning">Pending</Badge>, "1 day ago", "—"],
      [<span className="mono">DR-2085</span>, "Speakr Labs", "Consent Withdrawal", <Badge variant="info">Processing</Badge>, "6 hours ago", "Arjun Reddy"],
      [<span className="mono">DR-2081</span>, "ClearVoice AI", "Delete Account", <Badge variant="success">Completed</Badge>, "3 days ago", "Karthik Rao"],
    ]}
  />
);

export const AbuseMonitoring = () => (
  <GenericPage
    title="Abuse & Fraud Monitoring"
    subtitle="Unusual traffic, API key sharing and suspicious voice cloning."
    breadcrumb={["Security", "Abuse Monitoring"]}
    stats={[
      { label: "Auto-blocked Today", value: 18 },
      { label: "Flagged Accounts", value: 6 },
      { label: "Under Review", value: 3 },
      { label: "Cloned Voice Rejects", value: 12 },
    ]}
    columns={["Type", "Customer/IP", "Detected", "Risk Score", "Action Taken"]}
    rows={[
      ["Key sharing across IPs", <span>TechNova Solutions</span>, "2h ago", <Badge variant="warning">72</Badge>, "Notified customer"],
      ["Unusual traffic spike", <span className="mono">45.128.22.14</span>, "5h ago", <Badge variant="danger">94</Badge>, "IP blocked"],
      ["High failure rate", <span>Unknown API key</span>, "12h ago", <Badge variant="warning">65</Badge>, "Rate-limited"],
      ["Suspicious voice cloning", <span>Voxify AI</span>, "1d ago", <Badge variant="warning">58</Badge>, "Manual review"],
    ]}
  />
);
