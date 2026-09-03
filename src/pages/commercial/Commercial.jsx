import { useEffect, useState } from "react";
import GenericPage from "@/pages/GenericPage";
import { Badge } from "@/components/PageChrome";
import api from "@/lib/api";

export function Plans() {
  const [plans, setPlans] = useState([]);
  useEffect(() => { api.get("/plans").then(r => setPlans(r.data)); }, []);

  return (
    <GenericPage
      title="Plans & Subscriptions"
      subtitle="Manage pricing plans, features and customer subscriptions."
      breadcrumb={["Commercial", "Plans"]}
      showAdd cta="Add Plan"
      cards={plans.map(p => ({
        title: p.name,
        subtitle: p.name === "Custom" ? "Enterprise negotiated" : `₹${p.monthly.toLocaleString("en-IN")}/mo`,
        content: (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Included credits</span><span className="font-medium">{p.credits.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">API limit / day</span><span className="font-medium">{p.api_limit.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Concurrency</span><span className="font-medium">{p.concurrency}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Support</span><span className="font-medium">{p.support}</span></div>
            <div className="flex justify-between pt-2 border-t border-border"><span className="text-muted-foreground">Customers</span><Badge variant="info">{p.customers}</Badge></div>
          </div>
        ),
        footer: <div className="flex justify-between"><span className="text-muted-foreground">Monthly revenue</span><span className="font-medium">₹{p.revenue.toLocaleString("en-IN")}</span></div>,
      }))}
    />
  );
}

export function Billing() {
  const [d, setD] = useState(null);
  const [txns, setTxns] = useState([]);
  useEffect(() => {
    api.get("/billing/payments").then(r => setD(r.data));
    api.get("/billing/transactions").then(r => setTxns(r.data));
  }, []);
  return (
    <GenericPage
      title="Billing & Payments"
      subtitle="Payments, invoices, refunds and gateway logs."
      breadcrumb={["Commercial", "Billing"]}
      stats={d ? [
        { label: "Successful Payments", value: d.successful.toLocaleString("en-IN"), change: 12.4 },
        { label: "Failed Payments", value: d.failed.toLocaleString("en-IN"), change: -8.2 },
        { label: "Pending", value: d.pending, change: 4.1 },
        { label: "Revenue", value: `₹${(d.revenue / 100000).toFixed(1)}L`, change: 18.6 },
      ] : []}
      columns={["Txn ID", "Customer", "Amount", "Method", "Gateway", "Status", "Date"]}
      rows={txns.slice(0, 25).map(t => [
        <span className="mono">{t.id}</span>,
        t.customer,
        `₹${t.amount.toLocaleString("en-IN")}`,
        t.method,
        t.gateway,
        <Badge variant={t.status === "success" ? "success" : t.status === "failed" ? "danger" : "warning"}>{t.status}</Badge>,
        new Date(t.date).toLocaleDateString(),
      ])}
      filters={["All Gateways", "All Status", "Last 30 days"]}
    />
  );
}

export function Credits() {
  const [ov, setOv] = useState(null);
  const [txns, setTxns] = useState([]);
  useEffect(() => {
    api.get("/credits/overview").then(r => setOv(r.data));
    api.get("/credits/transactions").then(r => setTxns(r.data));
  }, []);
  return (
    <GenericPage
      title="Credits & Wallet"
      subtitle="Credit ledger, manual adjustments, expiry rules."
      breadcrumb={["Commercial", "Credits"]}
      stats={ov ? [
        { label: "Credits Issued", value: ov.issued.toLocaleString("en-IN") },
        { label: "Consumed", value: ov.consumed.toLocaleString("en-IN") },
        { label: "Bonus", value: ov.bonus.toLocaleString("en-IN") },
        { label: "Liability", value: ov.remaining_liability.toLocaleString("en-IN") },
      ] : []}
      columns={["Date", "Type", "Description", "Credits", "Balance", "Reference", "By"]}
      rows={txns.slice(0, 20).map(t => [
        new Date(t.date).toLocaleString(),
        <Badge variant={t.type === "usage" ? "danger" : t.type === "purchase" ? "success" : "info"}>{t.type}</Badge>,
        t.description,
        <span className={`mono ${t.credits < 0 ? "text-red-400" : "text-emerald-400"}`}>{t.credits > 0 ? "+" : ""}{t.credits}</span>,
        <span className="mono">{t.balance}</span>,
        <span className="mono text-muted-foreground">{t.reference}</span>,
        t.by,
      ])}
    />
  );
}
