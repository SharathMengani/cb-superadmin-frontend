import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader, Card, Badge } from "@/components/PageChrome";
import api from "@/lib/api";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  FileText, Eye, Save, Send, Clock, User, ChevronRight, Sparkles, ArrowLeft,
  Megaphone, Send as SendIcon, Users, TrendingUp, Mail, MessageCircle, Bell, CalendarClock
} from "lucide-react";

export function CMSEditor() {
  const [pages, setPages] = useState([]);
  const [selected, setSelected] = useState("blog-launch");
  const [page, setPage] = useState(null);
  const [tab, setTab] = useState("edit");
  const [form, setForm] = useState({ title: "", slug: "", body: "", seo_title: "", seo_description: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(() => {
    // Default: 1 hour from now, formatted for datetime-local input
    const d = new Date(Date.now() + 60 * 60 * 1000);
    d.setSeconds(0); d.setMilliseconds(0);
    return d.toISOString().slice(0, 16);
  });
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const loadList = () => api.get("/cms/pages").then(r => setPages(r.data));
  useEffect(() => { loadList(); }, []);
  useEffect(() => {
    if (!selected) return;
    api.get(`/cms/pages/${selected}`).then(r => {
      setPage(r.data);
      setForm({
        title: r.data.title || "", slug: r.data.slug || "",
        body: r.data.body || "", seo_title: r.data.seo_title || "",
        seo_description: r.data.seo_description || "",
      });
      if (r.data.scheduled_at) {
        setScheduledAt(new Date(r.data.scheduled_at).toISOString().slice(0, 16));
      }
      setDirty(false);
      setMessage(null);
    });
  }, [selected]);

  const updateField = (k, v) => { setForm(f => ({ ...f, [k]: v })); setDirty(true); };

  const save = async (action, extra = {}) => {
    setSaving(true); setMessage(null);
    try {
      const { data } = await api.put(`/cms/pages/${selected}`, {
        action, ...form, ...extra,
        changes_summary: action === "publish"
          ? "Published via editor"
          : action === "schedule"
            ? `Scheduled for ${new Date(extra.scheduled_at).toLocaleString()}`
            : "Draft saved",
      });
      setPage(data.page);
      setDirty(false);
      setMessage({
        type: "success",
        text: action === "publish"
          ? "Published successfully"
          : action === "schedule"
            ? `Scheduled for ${new Date(extra.scheduled_at).toLocaleString()}`
            : "Draft saved",
      });
      loadList();
    } catch (e) {
      setMessage({ type: "error", text: e.response?.data?.detail || "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleSchedule = () => {
    const ts = new Date(scheduledAt);
    if (isNaN(ts.getTime())) {
      setMessage({ type: "error", text: "Invalid schedule time" });
      return;
    }
    if (ts.getTime() <= Date.now()) {
      setMessage({ type: "error", text: "Schedule time must be in the future" });
      return;
    }
    setScheduleOpen(false);
    save("schedule", { scheduled_at: ts.toISOString() });
  };

  return (
    <div className="space-y-6" data-testid="page-cms-editor">
      <PageHeader
        title="CMS Editor"
        subtitle="Draft, preview, publish and schedule public content."
        breadcrumb={["Operations", "CMS", "Editor"]}
        actions={
          <div className="flex gap-2 items-center">
            {dirty && <span className="text-[11px] text-amber-400" data-testid="cms-dirty-indicator">● Unsaved changes</span>}
            <button
              disabled={saving} onClick={() => save("save")}
              data-testid="cms-save-draft-btn"
              className="h-9 px-3 rounded-lg bg-secondary border border-border text-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" /> Save Draft
            </button>
            <button
              onClick={() => setTab("preview")}
              className="h-9 px-3 rounded-lg bg-secondary border border-border text-xs flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <Popover open={scheduleOpen} onOpenChange={setScheduleOpen}>
              <PopoverTrigger asChild>
                <button
                  disabled={saving}
                  data-testid="cms-schedule-btn"
                  className="h-9 px-3 rounded-lg bg-secondary border border-border text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <CalendarClock className="w-3.5 h-3.5" /> Schedule
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 glass-card border-border" align="end" sideOffset={8}>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium">Schedule publish</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Content will go live automatically at this time.</div>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Publish at (local time)</label>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={e => setScheduledAt(e.target.value)}
                      data-testid="cms-schedule-input"
                      className="w-full h-9 px-2 rounded-md bg-secondary/60 border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <div className="text-[10px] text-muted-foreground mt-1">
                      = {new Date(scheduledAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      ["+1h", 60 * 60 * 1000],
                      ["+6h", 6 * 60 * 60 * 1000],
                      ["Tomorrow 9am", null],
                      ["Next Mon 9am", null],
                    ].map(([label, ms], i) => (
                      <button
                        key={label}
                        onClick={() => {
                          const d = new Date();
                          if (ms) d.setTime(d.getTime() + ms);
                          else if (i === 2) { d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0); }
                          else { const dow = d.getDay(); const add = ((1 - dow + 7) % 7) || 7; d.setDate(d.getDate() + add); d.setHours(9, 0, 0, 0); }
                          setScheduledAt(d.toISOString().slice(0, 16));
                        }}
                        data-testid={`cms-schedule-preset-${i}`}
                        className="h-6 px-2 rounded bg-secondary hover:bg-secondary/80 border border-border text-[10px]"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <button
                      onClick={() => setScheduleOpen(false)}
                      className="flex-1 h-8 rounded-md bg-secondary border border-border text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSchedule}
                      disabled={saving}
                      data-testid="cms-schedule-confirm"
                      className="flex-1 h-8 rounded-md btn-gradient text-xs font-medium disabled:opacity-50"
                    >
                      {saving ? "Scheduling..." : "Schedule"}
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <button
              disabled={saving} onClick={() => save("publish")}
              data-testid="cms-publish-btn"
              className="h-9 px-3 rounded-lg btn-gradient text-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" /> {saving ? "Publishing..." : "Publish"}
            </button>
          </div>
        }
      />

      {message && (
        <div
          data-testid="cms-message"
          className={`glass-card rounded-xl p-3 text-xs flex items-center gap-2 ${
            message.type === "success" ? "border-emerald-500/30 text-emerald-400" : "border-red-500/30 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Pages list */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-3 h-fit">
          <div className="text-xs font-medium mb-2 px-2">Pages</div>
          <div className="space-y-1">
            {pages.map(p => (
              <button
                key={p.id}
                data-testid={`cms-page-${p.id}`}
                onClick={() => setSelected(p.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${selected === p.id ? "bg-primary/15 text-primary-foreground" : "hover:bg-secondary"}`}
              >
                <div className="min-w-0">
                  <div className="text-xs font-medium truncate">{p.name}</div>
                  <div className="text-[10px] text-muted-foreground">v{p.version} · {p.last_editor || p.author}</div>
                </div>
                <Badge variant={p.status === "published" ? "success" : p.status === "draft" ? "warning" : "info"}>{p.status}</Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-9 space-y-4">
          {page && (
            <>
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-center gap-1 mb-3 border-b border-border pb-3">
                  {["edit", "preview", "seo", "revisions"].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-xs capitalize ${tab === t ? "bg-primary/20 text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`} data-testid={`cms-tab-${t}`}>{t}</button>
                  ))}
                  <div className="ml-auto text-[11px] text-muted-foreground flex items-center gap-2">
                    <Badge variant={page.status === "published" ? "success" : page.status === "draft" ? "warning" : "info"}>{page.status}</Badge>
                    <span className="mono">v{page.version}</span>
                    {page.status === "scheduled" && page.scheduled_at && (
                      <span className="flex items-center gap-1 text-blue-400" data-testid="cms-scheduled-info">
                        <CalendarClock className="w-3 h-3" />
                        {new Date(page.scheduled_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {tab === "edit" && (
                  <div className="space-y-3">
                    <input
                      className="w-full h-10 px-3 rounded-lg bg-secondary/60 border border-border text-sm font-medium"
                      value={form.title}
                      onChange={e => updateField("title", e.target.value)}
                      data-testid="cms-title-input"
                    />
                    <input
                      className="w-full h-9 px-3 rounded-lg bg-secondary/60 border border-border text-xs mono text-muted-foreground"
                      value={`/${form.slug}`}
                      onChange={e => updateField("slug", e.target.value.replace(/^\//, ""))}
                    />
                    <textarea
                      className="w-full min-h-[380px] p-3 rounded-lg bg-secondary/60 border border-border text-sm mono resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                      value={form.body}
                      onChange={e => updateField("body", e.target.value)}
                      data-testid="cms-body-textarea"
                    />
                  </div>
                )}

                {tab === "preview" && (
                  <div className="prose prose-invert max-w-none p-4 bg-secondary/30 rounded-lg">
                    <h1 className="text-2xl font-semibold mb-3">{form.title}</h1>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">{form.body}</div>
                  </div>
                )}

                {tab === "seo" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">SEO Title</label>
                      <input className="w-full h-10 px-3 rounded-lg bg-secondary/60 border border-border text-sm" value={form.seo_title} onChange={e => updateField("seo_title", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Meta Description</label>
                      <textarea className="w-full h-24 p-3 rounded-lg bg-secondary/60 border border-border text-sm" value={form.seo_description} onChange={e => updateField("seo_description", e.target.value)} />
                    </div>
                    <div className="glass-card rounded-lg p-3 mt-2">
                      <div className="text-xs text-muted-foreground mb-1">Search Preview</div>
                      <div className="text-blue-400 text-sm">{form.seo_title}</div>
                      <div className="text-green-500 text-xs mono">https://chatbucket.com/{form.slug}</div>
                      <div className="text-muted-foreground text-xs mt-1">{form.seo_description}</div>
                    </div>
                  </div>
                )}

                {tab === "revisions" && (
                  <div className="space-y-2">
                    {(page.revisions || []).map(r => (
                      <div key={r.version} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40 border border-border">
                        <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-xs font-semibold mono">v{r.version}</div>
                        <div className="flex-1">
                          <div className="text-xs font-medium">{r.changes}</div>
                          <div className="text-[10px] text-muted-foreground">{r.author} · {r.ts}</div>
                        </div>
                      </div>
                    ))}
                    {(!page.revisions || page.revisions.length === 0) && (
                      <div className="text-center text-xs text-muted-foreground py-6">No revisions yet.</div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function BroadcastCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  useEffect(() => { api.get("/broadcasts").then(r => setCampaigns(r.data)); }, []);

  const channelIcon = (c) => {
    if (c.includes("email")) return <Mail className="w-3.5 h-3.5" />;
    if (c.includes("sms")) return <MessageCircle className="w-3.5 h-3.5" />;
    if (c.includes("push")) return <Bell className="w-3.5 h-3.5" />;
    return <Megaphone className="w-3.5 h-3.5" />;
  };

  return (
    <div className="space-y-6" data-testid="page-broadcasts">
      <PageHeader
        title="Broadcast Campaigns"
        subtitle="Multi-channel campaigns with delivery, open and click reporting."
        breadcrumb={["Operations", "Broadcasts"]}
        actions={<button className="h-9 px-4 rounded-lg btn-gradient text-xs flex items-center gap-1.5"><Megaphone className="w-3.5 h-3.5" /> New Campaign</button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          [SendIcon, "Total Sent (30d)", "8,742"],
          [Users, "Audience Reached", "128,420"],
          [TrendingUp, "Avg Open Rate", "48.2%"],
          [Megaphone, "Active Campaigns", campaigns.filter(c => c.status !== "draft").length || 4],
        ].map(([Icon, label, val]) => (
          <div key={label} className="stat-card">
            <Icon className="w-4 h-4 text-primary-foreground mb-2" />
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-xl font-semibold mt-0.5">{val}</div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Campaign", "Channel", "Audience", "Delivered", "Opened", "Clicked", "Status", "Sent"].map(c => (
                <th key={c} className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => {
              const openRate = c.delivered ? ((c.opened / c.delivered) * 100).toFixed(0) : 0;
              const clickRate = c.delivered ? ((c.clicked / c.delivered) * 100).toFixed(0) : 0;
              return (
                <tr key={i} className="border-b border-border/60 table-row-hover">
                  <td className="px-4 py-3">
                    <div className="font-medium text-xs">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground mono">{c.id}</div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="info">{channelIcon(c.channel)} {c.channel}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="text-xs">{c.audience}</div>
                    <div className="text-[10px] text-muted-foreground mono">{c.audience_size.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3 text-xs mono">{c.delivered.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs mono">{c.opened.toLocaleString()}</div>
                    <div className="text-[10px] text-emerald-400">{openRate}%</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs mono">{c.clicked.toLocaleString()}</div>
                    <div className="text-[10px] text-emerald-400">{clickRate}%</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={c.status === "sent" ? "success" : c.status === "scheduled" ? "info" : c.status === "draft" ? "neutral" : "warning"}>{c.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{c.sent_at || c.scheduled || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
