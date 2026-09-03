import { useEffect, useState } from "react";
import GenericPage from "@/pages/GenericPage";
import { Badge } from "@/components/PageChrome";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

const genId = () => Math.random().toString(36).substring(2, 10).toUpperCase();
const rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const customers = ["TechNova Solutions", "Voxify AI", "LinguaVerse", "ChatterWise", "Global TransTech"];

export const ObsOverview = () => (
  <GenericPage
    title="Observability Overview"
    subtitle="Complete traceability across every request and session."
    breadcrumb={["Observability", "Overview"]}
    stats={[
      { label: "Total Requests (24h)", value: "532,142", change: 14.2 },
      { label: "Successful", value: "525,238", change: 12.8 },
      { label: "Failed", value: "6,904", change: -8.4 },
      { label: "Avg Latency", value: "156ms", change: -3.2 },
    ]}
    columns={["Customer", "Requests", "Success Rate", "Errors", "Avg Latency", "Credits Used"]}
    rows={customers.map(c => [
      <span className="font-medium">{c}</span>,
      <span className="mono">{rand(10000, 200000).toLocaleString("en-IN")}</span>,
      <Badge variant="success">{(97 + Math.random() * 2).toFixed(2)}%</Badge>,
      <span className="mono">{rand(50, 800)}</span>,
      <span className="mono">{rand(80, 300)}ms</span>,
      <span className="mono">{rand(1000, 50000).toLocaleString("en-IN")}</span>,
    ])}
  />
);

export const VoiceSessions = () => {
  const nav = useNavigate();
  const [sessions, setSessions] = useState([]);
  useEffect(() => { api.get("/observability/voice-sessions").then(r => setSessions(r.data)); }, []);
  return (
  <GenericPage
    title="Voice Sessions"
    subtitle="Every live voice interaction with full replay support. Click any row to inspect."
    breadcrumb={["Observability", "Voice Sessions"]}
    filters={["All Customers", "All Languages", "Last 24h"]}
    columns={["Session ID", "Customer", "Language", "Duration", "Latency", "Status", "Cost", "Started"]}
    rows={sessions.map(s => [
      <button className="mono text-primary-foreground hover:underline" onClick={() => nav(`/observability/voice/${s.id}`)}>{s.id}</button>,
      s.customer,
      s.language,
      <span className="mono">{s.duration_sec}s</span>,
      <span className="mono">{s.latency_ms}ms</span>,
      s.status === "completed" ? <Badge variant="success">{s.status}</Badge> : <Badge variant="danger">{s.status}</Badge>,
      <span className="mono">₹{s.cost}</span>,
      <span className="text-muted-foreground">{new Date(s.started_at).toLocaleTimeString()}</span>,
    ])}
  />
  );
};

export const ChatSessions = () => {
  const nav = useNavigate();
  const [sessions, setSessions] = useState([]);
  useEffect(() => { api.get("/observability/chat-sessions").then(r => setSessions(r.data)); }, []);
  return (
  <GenericPage
    title="Chat Sessions"
    subtitle="LLM chat and agent conversations with full traces. Click any row to inspect."
    breadcrumb={["Observability", "Chat Sessions"]}
    filters={["All Models", "All Status", "Last 24h"]}
    columns={["Session ID", "Customer", "Model", "Tokens", "Latency", "Cost", "Status", "Started"]}
    rows={sessions.map(s => [
      <button className="mono text-primary-foreground hover:underline" onClick={() => nav(`/observability/chat/${s.id}`)}>{s.id}</button>,
      s.customer,
      <Badge variant="info">{s.model}</Badge>,
      <span className="mono">{s.tokens.total.toLocaleString()}</span>,
      <span className="mono">{s.latency_ms}ms</span>,
      <span className="mono">₹{s.cost}</span>,
      <Badge variant="success">{s.status}</Badge>,
      <span className="text-muted-foreground">{new Date(s.started_at).toLocaleTimeString()}</span>,
    ])}
  />
  );
};

export const ApiLogs = () => (
  <GenericPage
    title="API Logs"
    subtitle="Every API call with response codes, latency and cost."
    breadcrumb={["Observability", "API Logs"]}
    filters={["All Endpoints", "All Status", "Last hour"]}
    columns={["Time", "Endpoint", "Customer", "IP", "Status", "Latency", "Credits"]}
    rows={Array.from({ length: 25 }).map(() => {
      const code = Math.random() > 0.05 ? 200 : [400, 401, 429, 500][rand(0, 4)];
      return [
        `${rand(1, 60)}s ago`,
        <span className="mono">/v1/{["paluku", "vinu", "vaaradhi", "thodu"][rand(0, 4)]}</span>,
        customers[rand(0, customers.length)],
        <span className="mono">203.192.{rand(0, 255)}.{rand(0, 255)}</span>,
        <Badge variant={code === 200 ? "success" : code >= 500 ? "danger" : "warning"}>{code}</Badge>,
        <span className="mono">{rand(50, 800)}ms</span>,
        <span className="mono">{rand(1, 500)}</span>,
      ];
    })}
  />
);

export const Errors = () => (
  <GenericPage
    title="Error Center"
    subtitle="All errors across services, grouped by code and reason."
    breadcrumb={["Observability", "Errors"]}
    stats={[
      { label: "Total Errors", value: "6,904", change: -8.4 },
      { label: "4xx Errors", value: "5,124" },
      { label: "5xx Errors", value: "1,780" },
      { label: "Error Rate", value: "1.34%" },
    ]}
    columns={["Time", "Code", "Reason", "Endpoint", "Customer", "Count"]}
    rows={[
      [<span>2 min ago</span>, <Badge variant="danger">500</Badge>, "GPU inference timeout", <span className="mono">/v1/paluku</span>, "TechNova Solutions", 42],
      [<span>5 min ago</span>, <Badge variant="warning">429</Badge>, "Rate limit exceeded", <span className="mono">/v1/vinu</span>, "Voxify AI", 128],
      [<span>12 min ago</span>, <Badge variant="warning">401</Badge>, "Invalid API key", <span className="mono">/v1/vaaradhi</span>, "Unknown", 8],
      [<span>25 min ago</span>, <Badge variant="danger">503</Badge>, "Service unavailable", <span className="mono">/v1/thodu</span>, "LinguaVerse", 15],
      [<span>1 hour ago</span>, <Badge variant="warning">400</Badge>, "Invalid audio format", <span className="mono">/v1/vinu</span>, "ChatterWise", 22],
    ]}
  />
);

export const Performance = () => (
  <GenericPage
    title="Latency & Performance"
    subtitle="Detailed latency percentiles across services and regions."
    breadcrumb={["Observability", "Performance"]}
    stats={[
      { label: "P50", value: "142ms" },
      { label: "P95", value: "412ms" },
      { label: "P99", value: "820ms" },
      { label: "Max", value: "2.4s" },
    ]}
    columns={["Service", "P50", "P95", "P99", "Region", "Model"]}
    rows={[
      ["CB Paluku", "142ms", "342ms", "620ms", "ap-south-1", "paluku-v2.3"],
      ["CB Vinu", "218ms", "428ms", "780ms", "ap-south-1", "vinu-v2.1"],
      ["CB Vaaradhi", "98ms", "245ms", "480ms", "ap-south-1", "vaaradhi-v1.5"],
      ["CB Thodu", "320ms", "820ms", "1.4s", "ap-south-1", "thodu-v2.2"],
    ]}
  />
);
