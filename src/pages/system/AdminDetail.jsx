import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader, Card, Badge } from "@/components/PageChrome";
import api from "@/lib/api";
import {
  ArrowLeft, Mail, Shield, Clock, Activity as ActivityIcon,
  CreditCard, UserCog, Receipt, FileEdit, Ticket as TicketIcon, Mic, AlertTriangle
} from "lucide-react";

const ACTION_ICON = {
  "credit.adjust": CreditCard, "plan.change": UserCog, "plan.edit": FileEdit,
  "billing.refund": Receipt, "customer.suspend": Shield, "customer.activate": Shield,
  "customer.block": Shield, "voice.approve": Mic, "voice.reject": Mic,
  "incident.create": AlertTriangle, "coupon.issue": TicketIcon,
};
const ACTION_COLOR = {
  "credit.adjust": "bg-cyan-500/15 text-cyan-400",
  "plan.change": "bg-indigo-500/15 text-indigo-400",
  "plan.edit": "bg-indigo-500/15 text-indigo-400",
  "billing.refund": "bg-amber-500/15 text-amber-400",
  "customer.suspend": "bg-red-500/15 text-red-400",
  "customer.block": "bg-red-500/15 text-red-400",
  "customer.activate": "bg-emerald-500/15 text-emerald-400",
  "voice.approve": "bg-emerald-500/15 text-emerald-400",
  "voice.reject": "bg-red-500/15 text-red-400",
  "incident.create": "bg-orange-500/15 text-orange-400",
  "coupon.issue": "bg-purple-500/15 text-purple-400",
};

function formatVal(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export default function AdminDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [a, setA] = useState(null);

  useEffect(() => { api.get(`/admins/${id}`).then(r => setA(r.data)); }, [id]);

  if (!a) return <div className="text-muted-foreground">Loading admin...</div>;

  return (
    <div className="space-y-6" data-testid="page-admin-detail">
      <PageHeader
        title={a.name}
        subtitle={a.email}
        breadcrumb={["System", "Admin Users", a.name]}
        actions={
          <button onClick={() => nav(-1)} className="h-9 px-3 rounded-lg bg-secondary border border-border text-xs flex items-center gap-1.5" data-testid="admin-detail-back">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        }
      />

      {/* Profile card */}
      <div className="glass-card rounded-2xl p-6 flex items-start gap-5">
        <div className="w-20 h-20 rounded-2xl btn-gradient flex items-center justify-center text-2xl font-semibold text-white">
          {a.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
        </div>
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-muted-foreground mb-1">Role</div>
            <Badge variant="info"><Shield className="w-3 h-3" />{a.role?.replace("_", " ")}</Badge>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Email</div>
            <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-muted-foreground" /><span className="font-medium">{a.email}</span></div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Joined</div>
            <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-muted-foreground" /><span className="font-medium">{new Date(a.created_at).toLocaleDateString()}</span></div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Total actions</div>
            <div className="flex items-center gap-1.5"><ActivityIcon className="w-3.5 h-3.5 text-muted-foreground" /><span className="font-medium">{a.total_actions}</span></div>
          </div>
        </div>
      </div>

      {/* Action breakdown */}
      {a.action_breakdown?.length > 0 && (
        <Card title="Action Breakdown" subtitle="What this admin does most often">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {a.action_breakdown.map(b => {
              const Icon = ACTION_ICON[b.action] || ActivityIcon;
              const color = ACTION_COLOR[b.action] || "bg-secondary text-foreground";
              return (
                <div key={b.action} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40 border border-border">
                  <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium mono">{b.action}</div>
                    <div className="text-xs text-muted-foreground">{b.count} {b.count === 1 ? "action" : "actions"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Activity timeline */}
      <Card title="Activity Timeline" subtitle={`${a.activity?.length || 0} recent actions`}>
        {a.activity?.length ? (
          <div className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
            <div className="space-y-4">
              {a.activity.map((log, i) => {
                const Icon = ACTION_ICON[log.action] || ActivityIcon;
                const color = ACTION_COLOR[log.action] || "bg-secondary text-foreground";
                const before = formatVal(log.before);
                const after = formatVal(log.after);
                return (
                  <div key={log.id} className="relative" data-testid={`timeline-item-${i}`}>
                    <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full ${color} flex items-center justify-center ring-4 ring-background`}>
                      <Icon className="w-2.5 h-2.5" />
                    </div>
                    <div className="glass-card rounded-xl p-3 hover:border-primary/40 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="mono text-xs text-primary-foreground">{log.action}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs">{log.target}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</span>
                      </div>
                      {(before || after) && (
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground overflow-x-auto">
                          {before && <span className="mono px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 whitespace-nowrap">-{before}</span>}
                          {after && <span className="mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 whitespace-nowrap">+{after}</span>}
                        </div>
                      )}
                      {log.meta?.reason && (
                        <div className="mt-2 text-[11px] text-muted-foreground italic">Reason: {log.meta.reason}</div>
                      )}
                      <div className="mt-1.5 text-[10px] text-muted-foreground mono">from {log.ip}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">No activity recorded for this admin yet.</div>
        )}
      </Card>
    </div>
  );
}
