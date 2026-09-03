import GenericPage from "@/pages/GenericPage";
import { Badge, Card, PageHeader } from "@/components/PageChrome";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const genData = (days) => Array.from({ length: days }).map((_, i) => ({ d: `D${i + 1}`, v: rand(80, 200) }));

export const CustomerAnalytics = () => (
  <GenericPage
    title="Customer Analytics"
    subtitle="New signups, churn, retention and top accounts."
    breadcrumb={["Analytics", "Customers"]}
    stats={[
      { label: "Active Customers", value: "2,456", change: 12.4 },
      { label: "Churn (30d)", value: "1.8%", change: -0.4 },
      { label: "New Users (30d)", value: "312", change: 21.5 },
      { label: "Retention (90d)", value: "94.2%", change: 2.1 },
    ]}
    cards={[{
      title: "Growth trend",
      content: (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={genData(30)}>
            <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(262 83% 62%)" stopOpacity={0.5} /><stop offset="100%" stopColor="hsl(262 83% 62%)" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 14%)" vertical={false} />
            <XAxis dataKey="d" tick={{ fill: "hsl(240 5% 55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(240 5% 55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(240 14% 8%)", border: "1px solid hsl(240 12% 14%)", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="v" stroke="hsl(262 83% 62%)" strokeWidth={2} fill="url(#g)" />
          </AreaChart>
        </ResponsiveContainer>
      ),
    }]}
  />
);

export const UsageAnalytics = () => (
  <GenericPage
    title="Usage Analytics"
    subtitle="Requests, tokens, models and language distribution."
    breadcrumb={["Analytics", "Usage"]}
    columns={["Model", "Requests", "Tokens", "Avg Latency", "Cost"]}
    rows={[
      ["paluku-v2.3", "128,432", "24.5M", "142ms", "₹2,45,800"],
      ["vinu-v2.1", "96,742", "18.4M", "218ms", "₹1,45,600"],
      ["vaaradhi-v1.5", "76,542", "8.4M", "98ms", "₹98,240"],
      ["thodu-v2.2", "42,120", "42.5M", "320ms", "₹5,82,100"],
    ]}
  />
);

export const RevenueAnalytics = () => (
  <GenericPage
    title="Cost & Margin Analytics"
    subtitle="Revenue, infrastructure cost and gross margin by customer."
    breadcrumb={["Analytics", "Revenue & Margin"]}
    columns={["Customer", "Revenue", "Infra Cost", "Model Cost", "Gross Margin"]}
    rows={[
      ["TechNova Solutions", "₹4,82,500", "₹85,400", "₹65,200", <Badge variant="success">68.7%</Badge>],
      ["Voxify AI Pvt Ltd", "₹3,61,200", "₹72,300", "₹58,400", <Badge variant="success">63.9%</Badge>],
      ["Global TransTech", "₹2,85,600", "₹98,200", "₹42,100", <Badge variant="warning">50.9%</Badge>],
      ["InnoTalk Systems", "₹2,45,080", "₹52,300", "₹28,400", <Badge variant="success">67.1%</Badge>],
      ["LinguaVerse", "₹21,890", "₹32,100", "₹18,200", <Badge variant="danger">-129.6%</Badge>],
    ]}
  />
);

export const Geography = () => (
  <GenericPage
    title="Geographic Analytics"
    subtitle="Location-wise traffic, peak hours and heatmap."
    breadcrumb={["Analytics", "Geography"]}
    columns={["Country", "State/Region", "Requests", "Peak Hour", "Active Users"]}
    rows={[
      ["India", "Telangana", "128,432", "2:00 PM IST", 480],
      ["India", "Karnataka", "98,432", "3:00 PM IST", 342],
      ["India", "Maharashtra", "82,340", "11:00 AM IST", 285],
      ["India", "Tamil Nadu", "65,432", "4:00 PM IST", 218],
      ["USA", "California", "42,300", "10:00 PM IST", 128],
      ["UK", "London", "28,400", "6:00 PM IST", 82],
    ]}
  />
);

export const Reports = () => (
  <GenericPage
    title="Reports"
    subtitle="Scheduled and on-demand reports across the platform."
    breadcrumb={["Analytics", "Reports"]}
    showAdd cta="Schedule Report"
    columns={["Name", "Type", "Frequency", "Last Run", "Recipients", "Status"]}
    rows={[
      ["Monthly Revenue", "Financial", "Monthly", "May 01, 2025", "3 people", <Badge variant="success">active</Badge>],
      ["Weekly Usage Digest", "Operational", "Weekly", "May 05, 2025", "8 people", <Badge variant="success">active</Badge>],
      ["Enterprise Health", "Executive", "Daily", "Today, 8:00 AM", "5 people", <Badge variant="success">active</Badge>],
      ["Compliance Audit", "Compliance", "Quarterly", "Apr 30, 2025", "2 people", <Badge variant="warning">paused</Badge>],
    ]}
  />
);
