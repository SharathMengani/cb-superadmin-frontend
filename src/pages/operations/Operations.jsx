import { useEffect, useState } from "react";
import GenericPage from "@/pages/GenericPage";
import { Badge } from "@/components/PageChrome";
import api from "@/lib/api";

export function Support() {
  const [tickets, setTickets] = useState([]);
  useEffect(() => { api.get("/support/tickets").then(r => setTickets(r.data)); }, []);
  const priorityBadge = (p) => ({
    low: <Badge variant="neutral">low</Badge>, medium: <Badge variant="info">medium</Badge>,
    high: <Badge variant="warning">high</Badge>, urgent: <Badge variant="danger">urgent</Badge>,
  }[p]);
  const statusBadge = (s) => ({
    open: <Badge variant="warning">open</Badge>, in_progress: <Badge variant="info">in progress</Badge>,
    waiting: <Badge variant="neutral">waiting</Badge>, resolved: <Badge variant="success">resolved</Badge>,
  }[s]);
  return (
    <GenericPage
      title="Support Center"
      subtitle="Customer tickets, complaints and satisfaction."
      breadcrumb={["Operations", "Support"]}
      stats={[
        { label: "Open Tickets", value: tickets.filter(t => t.status === "open").length || 18 },
        { label: "In Progress", value: tickets.filter(t => t.status === "in_progress").length || 5 },
        { label: "Avg Resolution", value: "4.2h" },
        { label: "SLA Breaches", value: 2 },
      ]}
      columns={["Ticket", "Subject", "Customer", "Priority", "Status", "Assigned"]}
      rows={tickets.map(t => [
        <span className="mono">{t.id}</span>, t.subject, t.customer, priorityBadge(t.priority), statusBadge(t.status), t.assigned,
      ])}
    />
  );
}

export const Notifications = () => (
  <GenericPage
    title="Notifications"
    subtitle="Email, SMS, push notifications and broadcast campaigns."
    breadcrumb={["Operations", "Notifications"]}
    showAdd cta="New Broadcast"
    columns={["Campaign", "Type", "Audience", "Sent", "Delivered", "Opened", "Status"]}
    rows={[
      ["Welcome Email v2", "Email", "New signups", 312, 308, "72%", <Badge variant="success">active</Badge>],
      ["Low Credits Alert", "Email + SMS", "Low balance", 128, 125, "84%", <Badge variant="success">active</Badge>],
      ["Maintenance Notice", "Broadcast", "All customers", 2843, 2799, "45%", <Badge variant="info">sent</Badge>],
      ["Payment Reminder", "Email", "Overdue", 42, 40, "62%", <Badge variant="success">active</Badge>],
      ["Feature Launch", "Push", "Pro + Enterprise", 892, 856, "38%", <Badge variant="warning">draft</Badge>],
    ]}
  />
);

export const Cms = () => (
  <GenericPage
    title="CMS & Public Content"
    subtitle="Homepage, pricing, docs, blog, FAQ and announcements."
    breadcrumb={["Operations", "CMS"]}
    cards={[
      { title: "Homepage", subtitle: "Last updated 2 days ago", description: "Hero section, features, testimonials, footer.", footer: <div className="flex justify-between"><span className="text-muted-foreground">Version</span><span>v18</span></div> },
      { title: "Pricing Page", subtitle: "Last updated 5 days ago", description: "All plans, feature comparison, FAQ.", footer: <div className="flex justify-between"><span className="text-muted-foreground">Version</span><span>v12</span></div> },
      { title: "Documentation", subtitle: "148 articles published", description: "Getting started, API reference, guides.", footer: <div className="flex justify-between"><span className="text-muted-foreground">Draft</span><span>4 articles</span></div> },
      { title: "Blog & Press", subtitle: "62 posts", description: "Product updates, engineering, case studies.", footer: <div className="flex justify-between"><span className="text-muted-foreground">Scheduled</span><span>2 posts</span></div> },
      { title: "FAQ & Announcements", subtitle: "42 questions", description: "Manage frequently asked questions and site-wide banners.", footer: <div className="flex justify-between"><span className="text-muted-foreground">Live announcement</span><span>1</span></div> },
    ]}
  />
);
