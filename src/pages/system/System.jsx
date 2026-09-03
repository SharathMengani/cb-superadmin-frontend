import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericPage from "@/pages/GenericPage";
import { Badge, PageHeader, Card } from "@/components/PageChrome";
import api from "@/lib/api";

export function AdminUsers() {
  const [admins, setAdmins] = useState([]);
  const nav = useNavigate();
  useEffect(() => { api.get("/admins").then(r => setAdmins(r.data)); }, []);
  return (
    <GenericPage
      title="Admin Users"
      subtitle="Internal ChatBucket admins with panel access. Click a row for full activity."
      breadcrumb={["System", "Admin Users"]}
      showAdd cta="Invite Admin"
      columns={["Name", "Email", "Role", "Actions (30d)", "Status", "Created", ""]}
      rows={admins.map(a => [
        <button className="font-medium hover:underline text-left" onClick={() => nav(`/system/admins/${a.id}`)} data-testid={`admin-row-${a.id}`}>{a.name}</button>,
        <span className="text-muted-foreground">{a.email}</span>,
        <Badge variant="info">{a.role?.replace("_", " ")}</Badge>,
        <Badge variant={a.actions_30d > 0 ? "success" : "neutral"}>{a.actions_30d ?? 0}</Badge>,
        <Badge variant="success">active</Badge>,
        new Date(a.created_at).toLocaleDateString(),
        <button className="text-xs text-primary-foreground" onClick={() => nav(`/system/admins/${a.id}`)}>View →</button>,
      ])}
    />
  );
}

export const Roles = () => (
  <GenericPage
    title="Roles & Permissions"
    subtitle="Role-based access matrix for the admin panel."
    breadcrumb={["System", "Roles"]}
    cards={[
      "Super Admin", "Finance Admin", "Support Admin", "Technical Admin",
      "Model Manager", "Content Manager", "Compliance Officer", "Read-only Auditor",
    ].map(r => ({
      title: r,
      subtitle: r === "Super Admin" ? "Full platform access" : "Scoped access",
      description: r === "Super Admin"
        ? "Every module, every action. Reserved for the founding team."
        : `Focused permissions covering the ${r.split(" ")[0].toLowerCase()} domain.`,
      footer: <div className="flex justify-between"><span className="text-muted-foreground">Assigned</span><span>{Math.floor(Math.random() * 5) + 1} admins</span></div>,
    }))}
  />
);

export const Infrastructure = () => (
  <GenericPage
    title="Infrastructure"
    subtitle="Servers, GPUs, containers, databases, storage and queues."
    breadcrumb={["System", "Infrastructure"]}
    stats={[
      { label: "Active Servers", value: 42 },
      { label: "GPUs", value: 18 },
      { label: "Containers", value: 128 },
      { label: "Databases", value: 8 },
    ]}
    columns={["Resource", "Type", "Region", "Utilization", "Status"]}
    rows={[
      ["gpu-a100-01", "GPU · NVIDIA A100", "ap-south-1", <Badge variant="success">72%</Badge>, <Badge variant="success">healthy</Badge>],
      ["gpu-a100-02", "GPU · NVIDIA A100", "ap-south-1", <Badge variant="warning">89%</Badge>, <Badge variant="success">healthy</Badge>],
      ["gpu-h100-01", "GPU · NVIDIA H100", "ap-south-1", <Badge variant="success">54%</Badge>, <Badge variant="success">healthy</Badge>],
      ["api-gateway-01", "Compute · c5.4xlarge", "ap-south-1", <Badge variant="success">45%</Badge>, <Badge variant="success">healthy</Badge>],
      ["db-primary", "Postgres 15", "ap-south-1", <Badge variant="success">32%</Badge>, <Badge variant="success">healthy</Badge>],
      ["redis-cache", "Redis Cluster", "ap-south-1", <Badge variant="success">28%</Badge>, <Badge variant="success">healthy</Badge>],
    ]}
  />
);

export const Incidents = () => (
  <GenericPage
    title="Incidents & Maintenance"
    subtitle="Active incidents, past events and scheduled maintenance."
    breadcrumb={["System", "Incidents"]}
    showAdd cta="Create Incident"
    columns={["ID", "Title", "Severity", "Affected", "Status", "Started"]}
    rows={[
      [<span className="mono">INC-2091</span>, "GPU cluster latency spike", <Badge variant="warning">minor</Badge>, "CB Paluku", <Badge variant="info">investigating</Badge>, "12 mins ago"],
      [<span className="mono">INC-2087</span>, "Scheduled Maintenance", <Badge variant="info">planned</Badge>, "Database", <Badge variant="warning">scheduled</Badge>, "May 14, 02:00"],
      [<span className="mono">INC-2081</span>, "Payment gateway timeout", <Badge variant="danger">major</Badge>, "Billing", <Badge variant="success">resolved</Badge>, "2 days ago"],
      [<span className="mono">INC-2075</span>, "Voice clone API slow", <Badge variant="warning">minor</Badge>, "CB Paluku", <Badge variant="success">resolved</Badge>, "5 days ago"],
    ]}
  />
);

export function Settings() {
  return (
    <div className="space-y-6" data-testid="page-settings">
      <PageHeader title="Settings" subtitle="Organization, payment, communication and storage settings." breadcrumb={["System", "Settings"]} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="General Settings">
          <div className="space-y-3 text-xs">
            {[["Company", "ChatBucket Business Pvt Ltd"], ["Address", "Hitech City, Hyderabad 500081"], ["GST", "36AACCC1234Z1Z5"], ["Currency", "INR (₹)"], ["Time Zone", "Asia/Kolkata"], ["Contact", "hello@chatbucket.com"]].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-border/60">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Payment Settings">
          <div className="space-y-3 text-xs">
            {[["Default Gateway", "Razorpay"], ["Backup Gateway", "Stripe"], ["Tax Rate (GST)", "18%"], ["Invoice Prefix", "INV-2025"], ["Minimum Recharge", "₹500"], ["Refund SLA", "5-7 business days"]].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-border/60">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Email & Communication">
          <div className="space-y-3 text-xs">
            {[["SMTP Host", "smtp.sendgrid.net"], ["Sender Name", "ChatBucket Team"], ["Reply-to", "support@chatbucket.com"], ["SMS Provider", "Twilio"], ["Push Provider", "Firebase FCM"]].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-border/60">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Storage & Data">
          <div className="space-y-3 text-xs">
            {[["Storage Provider", "AWS S3"], ["Audio Location", "ap-south-1"], ["Backup Frequency", "Daily @ 03:00 IST"], ["Encryption", "AES-256"], ["Default Retention", "30 days"]].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-border/60">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export const Integrations = () => (
  <GenericPage
    title="Integrations"
    subtitle="Third-party services connected to ChatBucket admin."
    breadcrumb={["System", "Integrations"]}
    cards={[
      { title: "Slack", subtitle: "Alerts & incident channel", description: "#alerts, #incidents", footer: <Badge variant="success">Connected</Badge> },
      { title: "Razorpay", subtitle: "Primary payment gateway", description: "Auto-reconciliation enabled", footer: <Badge variant="success">Connected</Badge> },
      { title: "Stripe", subtitle: "International payments", description: "USD, EUR, GBP supported", footer: <Badge variant="success">Connected</Badge> },
      { title: "SendGrid", subtitle: "Transactional email", description: "12k emails/day", footer: <Badge variant="success">Connected</Badge> },
      { title: "Twilio", subtitle: "SMS & voice OTP", description: "India + international routing", footer: <Badge variant="success">Connected</Badge> },
      { title: "HubSpot", subtitle: "CRM sync", description: "Contacts + deals two-way sync", footer: <Badge variant="warning">Configuring</Badge> },
      { title: "Datadog", subtitle: "Observability & APM", description: "All services monitored", footer: <Badge variant="success">Connected</Badge> },
      { title: "S3 / Cloudflare R2", subtitle: "Object storage", description: "Audio, logs, exports", footer: <Badge variant="success">Connected</Badge> },
    ]}
  />
);
