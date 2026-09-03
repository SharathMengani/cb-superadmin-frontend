import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader, Card, Badge } from "@/components/PageChrome";
import api from "@/lib/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Mail, Phone, MapPin, Building2, Shield, Calendar, CreditCard, Plus,
  Ban, KeyRound, RotateCcw, Trash2, UserX, ChevronRight, Activity
} from "lucide-react";

export default function CustomerProfile() {
  const { id } = useParams();
  const [c, setC] = useState(null);

  useEffect(() => {
    if (!id) return;
    api.get(`/customers/${id}`).then(r => setC(r.data)).catch(() => {});
  }, [id]);

  if (!c) return <div className="text-muted-foreground">Loading customer...</div>;

  return (
    <div className="space-y-6" data-testid="page-customer-profile">
      <PageHeader
        title="Customer Profile"
        breadcrumb={["Customers", "All Customers", c.name]}
      />

      {/* Header card */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center text-lg font-semibold text-white">
            {c.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-semibold">{c.name}</h2>
              <Badge variant="success">● {c.status}</Badge>
            </div>
            <div className="mt-1.5 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {c.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {c.phone}</span>
              <span>Customer ID: <span className="mono text-foreground">{c.id}</span></span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="h-9 px-3 rounded-lg bg-secondary border border-border text-xs">Edit</button>
            <button className="h-9 px-3 rounded-lg btn-gradient text-xs">Add Credits</button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 w-full justify-start gap-4">
          {["overview", "organization", "usage", "credits", "billing", "api_keys", "activity"].map(t => (
            <TabsTrigger key={t} value={t} className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary-foreground pb-3 capitalize" data-testid={`tab-${t}`}>
              {t.replace("_", " ")}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card title="Account Information">
              <div className="grid grid-cols-2 gap-4 text-xs">
                {[
                  ["Company Name", c.company_name || c.name],
                  ["Contact Email", c.email],
                  ["Phone Number", c.phone],
                  ["GST Number", c.gst || "—"],
                  ["Billing Address", c.billing_address || "—"],
                  ["Time Zone", "Asia/Kolkata (IST)"],
                  ["Website", "https://example.com"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-muted-foreground mb-1">{k}</div>
                    <div className="font-medium">{v}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Plan & Status" action={<button className="text-xs text-primary-foreground">Change Plan</button>}>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Current Plan</span><Badge variant="info">{c.plan}</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant="success">{c.status}</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Renewal Date</span><span className="font-medium">May 10, 2026</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Auto Recharge</span><Badge variant="success">Enabled</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Payment Method</span><span className="font-medium">VISA •••• 4242</span></div>
                <div className="pt-3 border-t border-border">
                  <div className="text-muted-foreground mb-2">Credits Overview</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div><div className="text-lg font-semibold">{c.credits_balance?.toLocaleString("en-IN")}</div><div className="text-[10px] text-muted-foreground">Total</div></div>
                    <div><div className="text-lg font-semibold text-emerald-400">{Math.floor((c.credits_balance || 0) * 0.75).toLocaleString("en-IN")}</div><div className="text-[10px] text-muted-foreground">Available</div></div>
                    <div><div className="text-lg font-semibold">74%</div><div className="text-[10px] text-muted-foreground">Utilization</div></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card title="Assigned Account Manager">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full btn-gradient flex items-center justify-center text-xs font-semibold">
                  {c.account_manager?.split(" ").map(w => w[0]).join("")}
                </div>
                <div>
                  <div className="font-medium text-sm">{c.account_manager}</div>
                  <div className="text-xs text-muted-foreground">arjun@chatbucket.com</div>
                </div>
              </div>
              <button className="h-9 px-3 rounded-lg bg-secondary border border-border text-xs">Change</button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {[
              ["Total Requests", (c.total_requests || 0).toLocaleString("en-IN")],
              ["Successful", (c.successful_requests || 0).toLocaleString("en-IN")],
              ["Failed", (c.failed_requests || 0).toLocaleString("en-IN")],
              ["Total Spend", `₹${(c.total_spend || 0).toLocaleString("en-IN")}`],
            ].map(([k, v]) => (
              <div key={k} className="stat-card">
                <div className="text-xs text-muted-foreground">{k}</div>
                <div className="text-2xl font-semibold mt-1">{v}</div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card title="Recent Activity">
            <div className="space-y-3 text-xs">
              {["API request to CB Paluku", "Voice session started", "Credits purchased", "Plan upgraded to Pro", "New API key created"].map((a, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-1">{a}</div>
                  <div className="text-muted-foreground">{i * 15 + 5} mins ago</div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {["organization", "credits", "billing", "api_keys"].map(t => (
          <TabsContent key={t} value={t} className="mt-6">
            <Card title={t.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}>
              <div className="text-sm text-muted-foreground">Detailed {t} data for this customer.</div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
