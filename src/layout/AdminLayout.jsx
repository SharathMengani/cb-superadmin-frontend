import { useState, useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/layout/Sidebar";
import api from "@/lib/api";
import { Bell, Search, ChevronDown, LogOut, User as UserIcon, Calendar, RefreshCw, Activity as ActivityIcon } from "lucide-react";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

function MyActivityPanel({ open, onClose }) {
  const [data, setData] = useState(null);
  const nav = useNavigate();
  useEffect(() => {
    if (!open) return;
    api.get("/admins/me").then(r => setData(r.data));
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} data-testid="my-activity-overlay" />
      <div className="fixed top-16 right-6 w-[420px] max-h-[75vh] glass-card rounded-2xl z-50 flex flex-col overflow-hidden" data-testid="my-activity-panel">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">My activity</div>
            {data && <div className="text-[11px] text-muted-foreground">{data.total_actions} total actions · showing last {data.activity?.length ?? 0}</div>}
          </div>
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground" data-testid="my-activity-close">Close</button>
        </div>

        {data?.top_actions?.length > 0 && (
          <div className="px-4 pt-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Top actions</div>
            <div className="flex flex-wrap gap-1.5">
              {data.top_actions.map(t => (
                <span key={t.action} className="text-[10px] mono px-2 py-0.5 rounded bg-primary/15 text-primary-foreground border border-primary/30">
                  {t.action} · {t.count}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {(data?.activity || []).map(a => (
            <div key={a.id} className="p-2.5 rounded-lg bg-secondary/30 border border-border hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] mono text-primary-foreground">{a.action}</span>
                <span className="text-[10px] text-muted-foreground">{new Date(a.created_at).toLocaleString()}</span>
              </div>
              <div className="text-xs mt-1">{a.target}</div>
              {a.meta?.reason && <div className="text-[10px] text-muted-foreground italic mt-1">Reason: {a.meta.reason}</div>}
            </div>
          ))}
          {data && (!data.activity || data.activity.length === 0) && (
            <div className="text-center py-8 text-xs text-muted-foreground">No activity recorded yet.</div>
          )}
          {!data && <div className="text-center py-8 text-xs text-muted-foreground">Loading...</div>}
        </div>

        {data?.id && (
          <div className="p-3 border-t border-border">
            <button
              onClick={() => { onClose(); nav(`/system/admins/${data.id}`); }}
              className="w-full h-9 rounded-lg btn-gradient text-xs font-medium"
              data-testid="my-activity-view-full"
            >
              View full profile & timeline →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={`transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6" data-testid="admin-topbar">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search customers, transactions, tickets..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="topbar-search"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg bg-secondary/60 border border-border text-xs text-muted-foreground hover:text-foreground" data-testid="topbar-date">
              <Calendar className="w-3.5 h-3.5" />
              {new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <div className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg bg-secondary/60 border border-border">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400 pulse-dot" />
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-muted-foreground">Auto refresh</span>
                <span className="text-[10px] font-medium text-foreground">30s</span>
              </div>
            </div>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-secondary/60 border border-border hover:bg-secondary" data-testid="notifications-btn">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 h-9 pl-1 pr-3 rounded-lg bg-secondary/60 border border-border hover:bg-secondary" data-testid="user-menu-btn">
                  <div className="w-7 h-7 rounded-md btn-gradient flex items-center justify-center text-[11px] font-semibold">
                    {(user.name || user.email || "SA").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col leading-tight text-left hidden md:flex">
                    <span className="text-xs font-medium">{user.name || "Super Admin"}</span>
                    <span className="text-[10px] text-muted-foreground">Super Admin</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-xs">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-muted-foreground">{user.email}</div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-testid="menu-profile"><UserIcon className="w-4 h-4 mr-2" /> Profile</DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-my-activity" onClick={() => setShowActivity(true)}>
                  <ActivityIcon className="w-4 h-4 mr-2" /> My activity
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} data-testid="menu-logout" className="text-red-400 focus:text-red-400">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-6" data-testid="admin-main">
          <Outlet />
        </main>
      </div>

      <MyActivityPanel open={showActivity} onClose={() => setShowActivity(false)} />
    </div>
  );
}
