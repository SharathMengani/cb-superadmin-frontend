import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader, Card, Badge } from "@/components/PageChrome";
import api from "@/lib/api";
import {
  Play, Pause, Download, Trash2, Clock, User, Volume2, Radio, ChevronRight,
  ArrowLeft, MessageSquare, Bot, Wrench, Shield
} from "lucide-react";

export function VoiceSessionDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [d, setD] = useState(null);
  const [playing, setPlaying] = useState(null);

  useEffect(() => { api.get(`/observability/voice-sessions/${id}`).then(r => setD(r.data)); }, [id]);
  if (!d) return <div className="text-muted-foreground">Loading session...</div>;

  const total = d.timeline.reduce((s, t) => s + t.duration_ms, 0);

  return (
    <div className="space-y-6" data-testid="page-voice-session-detail">
      <PageHeader
        title="Voice Session Detail"
        subtitle={<>Session <span className="mono text-foreground">{d.id}</span> · {d.customer}</>}
        breadcrumb={["Observability", "Voice Sessions", d.id]}
        actions={
          <div className="flex gap-2">
            <button onClick={() => nav(-1)} className="h-9 px-3 rounded-lg bg-secondary border border-border text-xs flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button className="h-9 px-3 rounded-lg bg-secondary border border-border text-xs flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button className="h-9 px-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          [Clock, "Duration", d.duration_sec + "s"],
          [Radio, "Latency", d.latency_ms + "ms"],
          [Volume2, "Language", d.language],
          [User, "User", d.user_id],
          [MessageSquare, "Cost", "₹" + d.cost],
        ].map(([Icon, label, val]) => (
          <div key={label} className="stat-card">
            <Icon className="w-4 h-4 text-primary-foreground mb-2" />
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-lg font-semibold mt-0.5 truncate">{val}</div>
          </div>
        ))}
      </div>

      {/* Audio players */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["input_audio_url", "output_audio_url"].map((k, i) => (
          <Card key={k} title={i === 0 ? "Input Audio" : "Output Audio"} subtitle={i === 0 ? "Customer's original voice" : "Generated agent response"}>
            <div className="flex items-center gap-3 mb-3">
              <button onClick={() => setPlaying(playing === k ? null : k)} className="w-11 h-11 rounded-full btn-gradient flex items-center justify-center">
                {playing === k ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
              </button>
              <div className="flex-1">
                <div className="h-8 flex items-center gap-0.5">
                  {Array.from({ length: 48 }).map((_, j) => (
                    <div key={j} className="flex-1 rounded-sm" style={{
                      height: `${20 + Math.sin(j / 3 + i) * 15 + Math.random() * 10}px`,
                      background: playing === k && j < 24 ? "hsl(262 83% 62%)" : "hsl(240 12% 22%)"
                    }} />
                  ))}
                </div>
                <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground mono">
                  <span>0:00</span><span>{Math.floor(d.duration_sec / 60)}:{(d.duration_sec % 60).toString().padStart(2, "0")}</span>
                </div>
              </div>
            </div>
            <button className="w-full h-8 rounded-md bg-secondary border border-border text-xs flex items-center justify-center gap-1.5">
              <Download className="w-3 h-3" /> Download
            </button>
          </Card>
        ))}
      </div>

      {/* Transcript / Translation / Response */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          ["Transcript (STT)", d.transcript, "text-amber-400", "bg-amber-500/10"],
          ["Translation", d.translation, "text-cyan-400", "bg-cyan-500/10"],
          ["Agent Response", d.agent_response, "text-purple-400", "bg-purple-500/10"],
        ].map(([label, val, color, bg]) => (
          <Card key={label} title={label}>
            <div className={`rounded-lg p-3 text-sm leading-relaxed ${bg} ${color}`}>{val}</div>
          </Card>
        ))}
      </div>

      {/* Timeline */}
      <Card title="Request Pipeline Timeline" subtitle={`Total: ${total}ms across ${d.timeline.length} stages`}>
        <div className="space-y-2">
          {d.timeline.map((t, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-semibold">
                {i + 1}
              </div>
              <div className="w-44 text-xs font-medium">{t.stage}</div>
              <div className="flex-1 h-6 relative bg-secondary/50 rounded overflow-hidden">
                <div
                  className="absolute top-0 h-full btn-gradient rounded"
                  style={{ left: `${(t.ts / total) * 100}%`, width: `${(t.duration_ms / total) * 100}%` }}
                />
              </div>
              <div className="w-16 text-right text-xs mono text-muted-foreground">{t.duration_ms}ms</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function ChatSessionDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [d, setD] = useState(null);

  useEffect(() => { api.get(`/observability/chat-sessions/${id}`).then(r => setD(r.data)); }, [id]);
  if (!d) return <div>Loading...</div>;

  return (
    <div className="space-y-6" data-testid="page-chat-session-detail">
      <PageHeader
        title="Chat Session Detail"
        subtitle={<>Model <Badge variant="info">{d.model}</Badge> · Latency {d.latency_ms}ms · {d.tokens.total.toLocaleString()} tokens</>}
        breadcrumb={["Observability", "Chat Sessions", d.id]}
        actions={<button onClick={() => nav(-1)} className="h-9 px-3 rounded-lg bg-secondary border border-border text-xs flex items-center gap-1.5"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          ["Model", d.model], ["Input Tokens", d.tokens.input.toLocaleString()],
          ["Output Tokens", d.tokens.output.toLocaleString()], ["Latency", d.latency_ms + "ms"],
          ["Cost", "₹" + d.cost],
        ].map(([k, v]) => (
          <div key={k} className="stat-card">
            <div className="text-xs text-muted-foreground">{k}</div>
            <div className="text-lg font-semibold mt-0.5">{v}</div>
          </div>
        ))}
      </div>

      <Card title="System Prompt" action={<Badge variant="success"><Shield className="w-3 h-3" /> Safety: {d.safety}</Badge>}>
        <div className="rounded-lg p-3 bg-secondary/50 border border-border text-sm font-mono text-muted-foreground leading-relaxed">
          {d.system_prompt}
        </div>
      </Card>

      <Card title="Conversation">
        <div className="space-y-3">
          {d.messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "" : "flex-row-reverse"}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-secondary" : "btn-gradient"}`}>
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[75%] rounded-2xl p-3 text-sm ${m.role === "user" ? "bg-secondary/70" : "bg-primary/15 border border-primary/30"}`}>
                <div>{m.content}</div>
                <div className="text-[10px] text-muted-foreground mt-1.5">{m.ts}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Tool Calls" subtitle={`${d.tool_calls.length} tools invoked`}>
        <div className="space-y-2">
          {d.tool_calls.map((t, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/40 border border-border">
              <Wrench className="w-4 h-4 text-primary-foreground" />
              <div className="flex-1">
                <div className="text-xs font-medium mono">{t.tool}</div>
                <div className="text-[10px] text-muted-foreground mono">{JSON.stringify(t.args)}</div>
              </div>
              <span className="text-xs mono text-muted-foreground">{t.duration_ms}ms</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function ConversationInspector() {
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [pipeline, setPipeline] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/observability/voice-sessions").then(r => {
      setSessions(r.data);
      if (r.data.length) setSelected(r.data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    api.get(`/observability/pipeline/${selected}`).then(r => setPipeline(r.data));
  }, [selected]);

  const iconMap = {
    input: Volume2, stt: Radio, lang: Shield, trans: MessageSquare,
    prompt: Wrench, llm: Bot, tts: Volume2, output: Play
  };
  const colorMap = {
    input: "bg-amber-500/15 text-amber-400", stt: "bg-cyan-500/15 text-cyan-400",
    lang: "bg-blue-500/15 text-blue-400", trans: "bg-emerald-500/15 text-emerald-400",
    prompt: "bg-indigo-500/15 text-indigo-400", llm: "bg-purple-500/15 text-purple-400",
    tts: "bg-pink-500/15 text-pink-400", output: "bg-primary/15 text-primary-foreground",
  };

  const filtered = sessions.filter(s =>
    !search || s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.customer.toLowerCase().includes(search.toLowerCase()) ||
    s.language.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6" data-testid="page-conversation-inspector">
      <PageHeader
        title="Conversation Inspector"
        subtitle="Deep-dive into every stage of the STT → Translation → LLM → TTS pipeline."
        breadcrumb={["Observability", "Conversation Inspector"]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Session picker */}
        <div className="lg:col-span-4 glass-card rounded-2xl p-3 h-fit">
          <div className="p-2 mb-1">
            <div className="text-xs font-medium mb-2">Load a session</div>
            <input
              placeholder="Search by ID, customer, language..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-secondary/60 border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="inspector-search"
            />
          </div>
          <div className="max-h-[560px] overflow-y-auto space-y-1">
            {filtered.map(s => (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
                data-testid={`session-picker-${s.id}`}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                  selected === s.id ? "bg-primary/15 border border-primary/40" : "hover:bg-secondary border border-transparent"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium mono">{s.id}</span>
                  <Badge variant={s.status === "completed" ? "success" : "danger"}>{s.status}</Badge>
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5 truncate">{s.customer}</div>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                  <span>{s.language}</span>
                  <span>·</span>
                  <span className="mono">{s.duration_sec}s</span>
                  <span>·</span>
                  <span className="mono">{s.latency_ms}ms</span>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center text-xs text-muted-foreground py-8">No matching sessions</div>
            )}
          </div>
        </div>

        {/* Pipeline */}
        <div className="lg:col-span-8">
          {pipeline ? (
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                <div>
                  <div className="text-xs text-muted-foreground">Inspecting Session</div>
                  <div className="text-lg font-semibold mono">{pipeline.session_id}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {pipeline.customer} · {new Date(pipeline.started_at).toLocaleString()} · {pipeline.duration_sec}s
                  </div>
                </div>
                <a href={`/observability/voice/${pipeline.session_id}`} className="h-9 px-3 rounded-lg btn-gradient text-xs flex items-center gap-1.5" data-testid="inspector-view-full">
                  Full Session <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="space-y-3">
                {pipeline.stages.map((s, i) => {
                  const Icon = iconMap[s.key] || Radio;
                  const color = colorMap[s.key] || "bg-secondary text-foreground";
                  return (
                    <div key={s.key} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {i < pipeline.stages.length - 1 && <div className="w-px flex-1 min-h-8 bg-border my-1" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="glass-card rounded-xl p-4 hover:border-primary/40 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium text-sm">{s.label}</div>
                            <div className="text-[10px] mono text-muted-foreground">{s.meta}</div>
                          </div>
                          <div className="text-xs text-muted-foreground">{s.desc}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-muted-foreground mb-1">Transcript</div>
                  <div className="text-amber-400 rounded-lg p-2 bg-amber-500/10">{pipeline.transcript}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Translation</div>
                  <div className="text-cyan-400 rounded-lg p-2 bg-cyan-500/10">{pipeline.translation}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Agent Response</div>
                  <div className="text-purple-400 rounded-lg p-2 bg-purple-500/10">{pipeline.agent_response}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-16 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/15 flex items-center justify-center mb-4">
                <Radio className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="text-sm text-muted-foreground">Select a session from the list to inspect its pipeline.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function RequestTraces() {
  const [traces, setTraces] = useState([]);
  const nav = useNavigate();
  useEffect(() => { api.get("/observability/traces").then(r => setTraces(r.data)); }, []);

  return (
    <div className="space-y-6" data-testid="page-request-traces">
      <PageHeader title="Request Traces" subtitle="Distributed tracing across every API request." breadcrumb={["Observability", "Request Traces"]} />
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Trace ID", "Endpoint", "Customer", "Status", "Latency", "Started", ""].map(c => (
                <th key={c} className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {traces.map(t => (
              <tr key={t.id} className="border-b border-border/60 table-row-hover cursor-pointer" onClick={() => nav(`/observability/traces/${t.id}`)}>
                <td className="px-4 py-3 mono text-xs text-primary-foreground">{t.id}</td>
                <td className="px-4 py-3 mono text-xs">{t.endpoint}</td>
                <td className="px-4 py-3 text-xs">{t.customer}</td>
                <td className="px-4 py-3"><Badge variant={t.status === 200 ? "success" : t.status >= 500 ? "danger" : "warning"}>{t.status}</Badge></td>
                <td className="px-4 py-3 mono text-xs">{t.latency_ms}ms</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{t.started}</td>
                <td className="px-4 py-3"><ChevronRight className="w-4 h-4 text-muted-foreground" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TraceDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [d, setD] = useState(null);
  useEffect(() => { api.get(`/observability/traces/${id}`).then(r => setD(r.data)); }, [id]);
  if (!d) return <div>Loading...</div>;

  const total = d.total_latency_ms;

  return (
    <div className="space-y-6" data-testid="page-trace-detail">
      <PageHeader
        title="Trace Detail"
        subtitle={<>Trace <span className="mono text-foreground">{d.id}</span> · {d.customer} · Total {total}ms</>}
        breadcrumb={["Observability", "Traces", d.id]}
        actions={<button onClick={() => nav(-1)} className="h-9 px-3 rounded-lg bg-secondary border border-border text-xs flex items-center gap-1.5"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>}
      />

      <Card title="Span Timeline" subtitle={`${d.spans.length} spans across the request lifecycle`}>
        <div className="space-y-2">
          {d.spans.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-semibold mono">{i + 1}</div>
              <div className="w-40">
                <div className="text-xs font-medium">{s.stage}</div>
                {s.note && <div className="text-[10px] text-muted-foreground">{s.note}</div>}
              </div>
              <div className="flex-1 h-6 relative bg-secondary/50 rounded overflow-hidden">
                <div className="absolute top-0 h-full btn-gradient rounded" style={{ left: `${(s.ts / total) * 100}%`, width: `${Math.max((s.duration_ms / total) * 100, 0.5)}%` }} />
              </div>
              <div className="w-20 text-right text-xs mono">{s.duration_ms}ms</div>
              <Badge variant={s.status === "ok" ? "success" : "danger"}>{s.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
