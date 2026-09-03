import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  LayoutDashboard, Users, Building2, ShoppingBag, CreditCard, Wallet,
  KeyRound, Mic, Ear, Languages, MessageSquare, Boxes, Radio, ChevronDown,
  BarChart3, LifeBuoy, Bell, FileText, Shield, ScrollText, Database,
  UserCog, Server, AlertTriangle, Settings, Plug, Activity, IndianRupee,
  Heart, ChevronLeft, ChevronRight, Sparkles
} from "lucide-react";

const NAV = [
  {
    section: "Dashboard",
    icon: LayoutDashboard,
    items: [
      { to: "/dashboard/overview", label: "Overview" },
      { to: "/dashboard/live", label: "Live Activity" },
      { to: "/dashboard/revenue", label: "Revenue" },
      { to: "/dashboard/status", label: "System Status" },
    ],
  },
  {
    section: "Customers",
    icon: Users,
    items: [
      { to: "/customers/all", label: "All Customers" },
      { to: "/customers/organizations", label: "Organizations" },
      { to: "/customers/users", label: "Users & Teams" },
      { to: "/customers/projects", label: "Projects" },
    ],
  },
  {
    section: "Commercial",
    icon: ShoppingBag,
    items: [
      { to: "/commercial/plans", label: "Plans & Subscriptions" },
      { to: "/commercial/billing", label: "Billing & Payments" },
      { to: "/commercial/credits", label: "Credits & Wallet" },
    ],
  },
  {
    section: "Platform",
    icon: Boxes,
    items: [
      { to: "/platform/api", label: "API Management" },
      { to: "/platform/paluku", label: "CB Paluku" },
      { to: "/platform/vinu", label: "CB Vinu" },
      { to: "/platform/vaaradhi", label: "CB Vaaradhi" },
      { to: "/platform/thodu", label: "CB Thodu" },
      { to: "/platform/voices", label: "Voice Library" },
      { to: "/platform/languages", label: "Languages" },
    ],
  },
  {
    section: "Observability",
    icon: Radio,
    badge: "New",
    items: [
      { to: "/observability/overview", label: "Overview" },
      { to: "/observability/voice", label: "Voice Sessions" },
      { to: "/observability/chat", label: "Chat Sessions" },
      { to: "/observability/inspector", label: "Conversation Inspector" },
      { to: "/observability/traces", label: "Request Traces" },
      { to: "/observability/logs", label: "API Logs" },
      { to: "/observability/errors", label: "Errors" },
      { to: "/observability/performance", label: "Performance" },
      { to: "/observability/audio", label: "Audio Storage" },
      { to: "/observability/retention", label: "Custom Retention" },
      { to: "/observability/plans", label: "Observability Plans" },
    ],
  },
  {
    section: "Analytics",
    icon: BarChart3,
    items: [
      { to: "/analytics/customers", label: "Customers" },
      { to: "/analytics/usage", label: "Usage" },
      { to: "/analytics/revenue", label: "Revenue & Margin" },
      { to: "/analytics/geography", label: "Geography" },
      { to: "/analytics/reports", label: "Reports" },
    ],
  },
  {
    section: "Operations",
    icon: LifeBuoy,
    items: [
      { to: "/operations/support", label: "Support" },
      { to: "/operations/notifications", label: "Notifications" },
      { to: "/operations/broadcasts", label: "Broadcast Campaigns" },
      { to: "/operations/cms", label: "CMS" },
      { to: "/operations/cms/editor", label: "CMS Editor" },
    ],
  },
  {
    section: "Security",
    icon: Shield,
    items: [
      { to: "/security/dashboard", label: "Security Dashboard" },
      { to: "/security/audit", label: "Audit Logs" },
      { to: "/security/retention", label: "Data Retention" },
      { to: "/security/requests", label: "Data Requests" },
      { to: "/security/abuse", label: "Abuse Monitoring" },
      { to: "/security/fraud", label: "Fraud Auto-Actions" },
    ],
  },
  {
    section: "System",
    icon: Settings,
    items: [
      { to: "/system/admins", label: "Admin Users" },
      { to: "/system/roles", label: "Roles & Permissions" },
      { to: "/system/infrastructure", label: "Infrastructure" },
      { to: "/system/gpu", label: "GPU Monitoring" },
      { to: "/system/incidents", label: "Incidents" },
      { to: "/system/maintenance", label: "Maintenance Scheduler" },
      { to: "/system/webhooks", label: "Webhooks & Jobs" },
      { to: "/system/settings", label: "Settings" },
      { to: "/system/integrations", label: "Integrations" },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const [open, setOpen] = useState(() => {
    const cur = NAV.find(s => s.items.some(i => location.pathname.startsWith(i.to)));
    return cur ? cur.section : "Dashboard";
  });
  const [credits, setCredits] = useState(984.58);

  // Keep sidebar section-open state in sync with route changes
  useEffect(() => {
    const cur = NAV.find(s => s.items.some(i => location.pathname.startsWith(i.to)));
    if (cur && cur.section !== open) setOpen(cur.section);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    api.get("/dashboard/overview").then(r => {
      if (r.data?.platform_credits) setCredits(r.data.platform_credits);
    }).catch(() => {});
  }, []);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[hsl(var(--sidebar-bg))] border-r border-border flex flex-col transition-all duration-300 z-30 ${collapsed ? "w-16" : "w-64"}`}
      data-testid="admin-sidebar"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-border shrink-0">
        <div className="relative w-9 h-9 rounded-lg flex items-center justify-center btn-gradient shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-semibold text-foreground">ChatBucket</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Business</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV.map((s) => {
          const Icon = s.icon;
          const isOpen = open === s.section && !collapsed;
          const hasActive = s.items.some((i) => location.pathname.startsWith(i.to));
          return (
            <div key={s.section}>
              <button
                onClick={() => setOpen(isOpen ? "" : s.section)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  hasActive ? "text-foreground bg-secondary/60" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
                data-testid={`nav-section-${s.section.toLowerCase()}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{s.section}</span>
                    {s.badge && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-primary/20 text-primary-foreground border border-primary/40">
                        {s.badge}
                      </span>
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </>
                )}
              </button>
              {isOpen && (
                <div className="ml-4 mt-0.5 mb-1 pl-3 border-l border-border/60 space-y-0.5">
                  {s.items.map((i) => (
                    <NavLink
                      key={i.to}
                      to={i.to}
                      data-testid={`nav-link-${i.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                      className={({ isActive }) =>
                        `block px-3 py-1.5 rounded-md text-[13px] transition-colors ${
                          isActive ? "text-primary-foreground bg-primary/20" : "text-muted-foreground hover:text-foreground"
                        }`
                      }
                    >
                      {i.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Credit widget */}
      {!collapsed && (
        <div className="p-3 border-t border-border">
          <div className="glass-card rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Wallet className="w-3.5 h-3.5" /> Platform Credits
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <IndianRupee className="w-4 h-4 text-primary-foreground" />
              <span className="text-xl font-semibold">{credits.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
              <div className="h-full btn-gradient" style={{ width: "98%" }} />
            </div>
            <div className="mt-1.5 text-[10px] text-muted-foreground">98.4% Remaining</div>
          </div>
        </div>
      )}

      <button
        onClick={onToggle}
        data-testid="sidebar-toggle"
        className="mx-3 mb-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /> Collapse</>}
      </button>
    </aside>
  );
}
