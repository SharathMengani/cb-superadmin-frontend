import { Card, PageHeader, Badge } from "@/components/PageChrome";
import { useEffect, useRef, useState, useCallback } from "react";
import api, { API } from "@/lib/api";
import {
  Activity, Radio, MessageSquare, Zap, AlertCircle, Users, PhoneCall, Languages,
  Wifi, WifiOff, RefreshCw, Heart
} from "lucide-react";

// Heartbeat expected every ~15s; treat stream as stale after 8s of silence
const STALE_MS = 8000;
const BACKOFF_STEPS = [1000, 2000, 5000, 10000, 20000];

export default function LiveActivity() {
  const [d, setD] = useState(null);
  const [status, setStatus] = useState("connecting"); // connecting | live | stale | reconnecting
  const [lastTick, setLastTick] = useState(null);
  const [lastHeartbeat, setLastHeartbeat] = useState(null);
  const [reconnectAt, setReconnectAt] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [attempt, setAttempt] = useState(0);

  const esRef = useRef(null);
  const staleTimerRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const sessionIdRef = useRef(`sess_${Math.random().toString(36).slice(2, 10)}`);

  const openStream = useCallback(() => {
    const token = localStorage.getItem("cb_token");
    if (!token) return;
    try { esRef.current?.close(); } catch {}
    setStatus("connecting");
    const url = `${API}/dashboard/live-activity/stream?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);
    esRef.current = es;

    const bumpStaleWatcher = () => {
      if (staleTimerRef.current) clearTimeout(staleTimerRef.current);
      staleTimerRef.current = setTimeout(() => setStatus("stale"), STALE_MS);
    };

    es.addEventListener("hello", () => {
      setStatus("live"); setAttempt(0); bumpStaleWatcher();
    });
    es.addEventListener("tick", (e) => {
      try {
        const payload = JSON.parse(e.data);
        setD(payload);
        setLastTick(payload.ts);
        setStatus("live");
        bumpStaleWatcher();
      } catch {}
    });
    es.addEventListener("heartbeat", (e) => {
      try {
        const { ts } = JSON.parse(e.data);
        setLastHeartbeat(ts);
        bumpStaleWatcher();
      } catch {}
    });
    es.onerror = () => {
      es.close();
      esRef.current = null;
      if (staleTimerRef.current) clearTimeout(staleTimerRef.current);
      const nextAttempt = attempt + 1;
      const next = BACKOFF_STEPS[Math.min(attempt, BACKOFF_STEPS.length - 1)];
      setStatus("reconnecting");
      setReconnectAt(Date.now() + next);
      setAttempt(nextAttempt);
      // Only record audit on 2nd+ consecutive failure to avoid noise from a
      // single hiccup (page-load races, network blips).
      if (nextAttempt >= 2) {
        api.post("/audit/sse-event", {
          kind: "reconnect",
          attempt: nextAttempt,
          reason: "EventSource error",
          session_id: sessionIdRef.current,
        }).catch(() => {});
      }
      reconnectTimerRef.current = setTimeout(openStream, next);
    };
  }, [attempt]);

  useEffect(() => {
    // Prime with snapshot then open stream
    api.get("/dashboard/live-activity").then(r => setD(r.data)).catch(() => {});
    openStream();
    return () => {
      try { esRef.current?.close(); } catch {}
      if (staleTimerRef.current) clearTimeout(staleTimerRef.current);
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown ticker for reconnecting UI
  useEffect(() => {
    if (status !== "reconnecting") { setCountdown(0); return; }
    const i = setInterval(() => {
      setCountdown(Math.max(0, Math.ceil((reconnectAt - Date.now()) / 1000)));
    }, 250);
    return () => clearInterval(i);
  }, [status, reconnectAt]);

  const manualReconnect = () => {
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    setAttempt(0);
    openStream();
  };

  const StatusPill = () => {
    if (status === "live") return (
      <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs" data-testid="sse-status">
        <Wifi className="w-3.5 h-3.5 pulse-dot" /> Live · SSE
      </div>
    );
    if (status === "stale") return (
      <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs" data-testid="sse-status">
        <Heart className="w-3.5 h-3.5" /> Stale · waiting for heartbeat
      </div>
    );
    if (status === "connecting") return (
      <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs" data-testid="sse-status">
        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Connecting...
      </div>
    );
    return (
      <div className="flex items-center gap-2" data-testid="sse-status">
        <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs">
          <WifiOff className="w-3.5 h-3.5" /> Reconnecting in {countdown}s (attempt {attempt})
        </div>
        <button onClick={manualReconnect} className="h-9 px-3 rounded-lg btn-gradient text-xs flex items-center gap-1.5" data-testid="sse-reconnect-btn">
          <RefreshCw className="w-3.5 h-3.5" /> Retry now
        </button>
      </div>
    );
  };

  const isFresh = status === "live";
  const dotClass = isFresh ? "bg-emerald-400 pulse-dot" : status === "stale" ? "bg-amber-400" : "bg-red-400";

  const tiles = d ? [
    { icon: Zap, label: "Requests / sec", value: d.requests_per_second, color: "text-purple-400", bg: "bg-purple-500/15" },
    { icon: Activity, label: "Active API calls", value: d.active_api_calls, color: "text-cyan-400", bg: "bg-cyan-500/15" },
    { icon: Radio, label: "Live STT sessions", value: d.live_stt_sessions, color: "text-amber-400", bg: "bg-amber-500/15" },
    { icon: MessageSquare, label: "Live TTS requests", value: d.live_tts_requests, color: "text-pink-400", bg: "bg-pink-500/15" },
    { icon: Languages, label: "Live Translations", value: d.live_translations, color: "text-emerald-400", bg: "bg-emerald-500/15" },
    { icon: Users, label: "Live Chat Agents", value: d.live_chat_agents, color: "text-blue-400", bg: "bg-blue-500/15" },
    { icon: PhoneCall, label: "Live Voice Agents", value: d.live_voice_agents, color: "text-indigo-400", bg: "bg-indigo-500/15" },
    { icon: AlertCircle, label: "Errors", value: d.errors, color: "text-red-400", bg: "bg-red-500/15" },
  ] : [];

  return (
    <div className="space-y-6" data-testid="page-live-activity">
      <PageHeader
        title="Live Activity"
        subtitle="Realtime pulse of platform traffic and services — streaming via Server-Sent Events."
        breadcrumb={["Dashboard", "Live Activity"]}
        actions={<StatusPill />}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tiles.map(t => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl ${t.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${t.color}`} />
                </div>
                <div className={`w-2 h-2 rounded-full ${dotClass}`} />
              </div>
              <div className="text-xs text-muted-foreground mt-3">{t.label}</div>
              <div className={`text-2xl font-semibold transition-all duration-500 ${!isFresh ? "opacity-60" : ""}`}>{t.value}</div>
            </div>
          );
        })}
      </div>

      <Card
        title="Recent Customer Activity"
        subtitle={
          lastTick
            ? `Last tick ${new Date(lastTick).toLocaleTimeString()}${lastHeartbeat ? ` · heartbeat ${new Date(lastHeartbeat).toLocaleTimeString()}` : ""}`
            : "Waiting for stream..."
        }
      >
        <div className="space-y-2">
          {(d?.recent_activity || []).map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-border/60 last:border-0 text-xs">
              <div className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
              <span className="text-muted-foreground w-20">{a.time}</span>
              <span className="font-medium">{a.customer}</span>
              <span className="text-muted-foreground">{a.action}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
