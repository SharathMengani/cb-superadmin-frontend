import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, StatCard, Badge } from "@/components/PageChrome";
import api from "@/lib/api";
import { Users, UserCheck, Building2, Ban, Download, Search, MoreVertical, ChevronDown } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";

export default function AllCustomers() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState("");
  const nav = useNavigate();

  const load = async () => {
    const { data } = await api.get("/customers", { params: { q, status, plan } });
    setRows(data.customers || []);
  };
  useEffect(() => { load(); }, [q, status, plan]);

  const stats = {
    total: rows.length || 2843,
    active: rows.filter(r => r.status === "active").length || 2456,
    enterprise: rows.filter(r => r.plan === "Enterprise").length || 386,
    suspended: rows.filter(r => r.status === "suspended" || r.status === "blocked").length || 87,
  };

  const statusBadge = (s) => {
    if (s === "active") return <Badge variant="success">Active</Badge>;
    if (s === "suspended") return <Badge variant="warning">Suspended</Badge>;
    if (s === "blocked") return <Badge variant="danger">Blocked</Badge>;
    return <Badge variant="neutral">{s}</Badge>;
  };

  const planBadge = (p) => {
    const v = { "Enterprise": "info", "Pro": "success", "Starter": "warning", "Free": "neutral" }[p] || "neutral";
    return <Badge variant={v}>{p}</Badge>;
  };

  return (
    <div className="space-y-6" data-testid="page-all-customers">
      <PageHeader
        title="All Customers"
        subtitle="Manage and monitor all customer accounts and organizations."
        breadcrumb={["Customers", "All Customers"]}
        actions={
          <button className="h-9 px-4 rounded-lg btn-gradient text-xs font-medium flex items-center gap-2" data-testid="export-btn">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Customers" value={stats.total.toLocaleString("en-IN")} change={12.4} iconBg="bg-purple-500/15" iconColor="text-purple-400" />
        <StatCard icon={UserCheck} label="Active Customers" value={stats.active.toLocaleString("en-IN")} change={13.7} iconBg="bg-emerald-500/15" iconColor="text-emerald-400" />
        <StatCard icon={Building2} label="Enterprise Customers" value={stats.enterprise.toLocaleString("en-IN")} change={6.6} iconBg="bg-cyan-500/15" iconColor="text-cyan-400" />
        <StatCard icon={Ban} label="Suspended Customers" value={stats.suspended.toLocaleString("en-IN")} change={-3.2} changeType="down" iconBg="bg-red-500/15" iconColor="text-red-400" />
      </div>

      <div className="glass-card rounded-2xl">
        <div className="p-4 border-b border-border flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search customers by name, email, domain or ID..."
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="customer-search"
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 px-3 rounded-lg bg-secondary/60 border border-border text-sm" data-testid="filter-status">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="blocked">Blocked</option>
          </select>
          <select value={plan} onChange={(e) => setPlan(e.target.value)} className="h-10 px-3 rounded-lg bg-secondary/60 border border-border text-sm" data-testid="filter-plan">
            <option value="">All Plans</option>
            <option>Enterprise</option><option>Pro</option><option>Starter</option><option>Free</option>
          </select>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Spend (₹)</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((c) => (
              <TableRow key={c.id} className="border-border cursor-pointer table-row-hover" onClick={() => nav(`/customers/all/${c.id}`)} data-testid={`row-${c.id}`}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md btn-gradient flex items-center justify-center text-[10px] font-semibold text-white">
                      {c.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <div className="text-xs font-medium">{c.name}</div>
                      <div className="text-[10px] text-muted-foreground">{c.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.type}</TableCell>
                <TableCell>{planBadge(c.plan)}</TableCell>
                <TableCell>{statusBadge(c.status)}</TableCell>
                <TableCell className="text-xs mono">{c.credits_balance?.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-xs mono">{c.total_spend?.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.join_date}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.last_active}</TableCell>
                <TableCell><MoreVertical className="w-4 h-4 text-muted-foreground" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 flex items-center justify-between border-t border-border">
          <div className="text-xs text-muted-foreground">Showing 1 to {rows.length} of 2,843 customers</div>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-8 h-8 rounded-md text-xs ${p === 1 ? "btn-gradient" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{p}</button>
            ))}
            <span className="text-xs text-muted-foreground px-2">...</span>
            <button className="w-8 h-8 rounded-md text-xs bg-secondary text-muted-foreground">356</button>
          </div>
        </div>
      </div>
    </div>
  );
}
