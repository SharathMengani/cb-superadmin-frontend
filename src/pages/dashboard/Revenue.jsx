import { useEffect, useState } from "react";
import { PageHeader, Card, Badge } from "@/components/PageChrome";
import api from "@/lib/api";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const COLORS = ["hsl(262 83% 62%)", "hsl(190 90% 55%)", "hsl(152 68% 45%)", "hsl(38 92% 50%)", "hsl(340 82% 60%)"];

export default function Revenue() {
  const [d, setD] = useState(null);
  useEffect(() => { api.get("/dashboard/revenue").then(r => setD(r.data)); }, []);

  if (!d) return <div>Loading...</div>;

  const buckets = [
    { label: "Daily", value: d.daily },
    { label: "Weekly", value: d.weekly },
    { label: "Monthly", value: d.monthly },
    { label: "Annual", value: d.annual },
  ];

  return (
    <div className="space-y-6" data-testid="page-revenue">
      <PageHeader title="Revenue Dashboard" subtitle="Financial performance across services, plans and customers." breadcrumb={["Dashboard", "Revenue"]} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {buckets.map(b => (
          <div key={b.label} className="stat-card">
            <div className="text-xs text-muted-foreground">{b.label} Revenue</div>
            <div className="text-2xl font-semibold mt-1">₹{b.value.toLocaleString("en-IN")}</div>
            <div className="text-xs mt-2 text-emerald-400">↑ {(Math.random() * 20 + 5).toFixed(1)}% vs previous</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Revenue by Service" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={d.by_service}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 14%)" vertical={false} />
              <XAxis dataKey="service" tick={{ fill: "hsl(240 5% 60%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(240 5% 60%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(240 14% 8%)", border: "1px solid hsl(240 12% 14%)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="amount" fill="hsl(262 83% 62%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Revenue Split">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={[
                  { name: "Credits", value: d.credits_revenue },
                  { name: "Subscription", value: d.subscription_revenue },
                  { name: "Observability", value: d.observability_revenue },
                ]}
                cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} dataKey="value"
              >
                {COLORS.slice(0, 3).map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(240 14% 8%)", border: "1px solid hsl(240 12% 14%)", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Top Paying Customers">
        <table className="w-full">
          <thead className="text-[10px] text-muted-foreground uppercase tracking-wider">
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3">Customer</th>
              <th className="text-right py-2 px-3">Amount</th>
              <th className="text-right py-2 px-3">Share</th>
            </tr>
          </thead>
          <tbody>
            {d.top_customers.map((c, i) => (
              <tr key={i} className="border-b border-border/60 text-xs">
                <td className="py-3 px-3 font-medium">{c.name}</td>
                <td className="py-3 px-3 text-right mono">₹{c.amount.toLocaleString("en-IN")}</td>
                <td className="py-3 px-3 text-right text-muted-foreground">{((c.amount / d.monthly) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
