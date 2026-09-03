import { useEffect, useState } from "react";
import GenericPage from "@/pages/GenericPage";
import { Badge } from "@/components/PageChrome";
import api from "@/lib/api";

export function AllUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => { api.get("/users").then(r => setUsers(r.data)); }, []);
  return (
    <GenericPage
      title="Users & Teams"
      subtitle="All customer organization users, roles, invitations."
      breadcrumb={["Customers", "Users & Teams"]}
      showAdd cta="Invite User"
      columns={["User", "Email", "Organization", "Role", "Status", "Last Login"]}
      rows={users.map(u => [
        <span className="font-medium">{u.name}</span>,
        <span className="text-muted-foreground">{u.email}</span>,
        u.organization,
        <Badge variant={u.role === "Owner" ? "info" : u.role === "Admin" ? "success" : "neutral"}>{u.role}</Badge>,
        <Badge variant={u.status === "active" ? "success" : u.status === "invited" ? "warning" : "danger"}>{u.status}</Badge>,
        <span className="text-muted-foreground">{u.last_login}</span>,
      ])}
    />
  );
}

export function Organizations() {
  return (
    <GenericPage
      title="Organizations"
      subtitle="Enterprise multi-tenant accounts and their teams."
      breadcrumb={["Customers", "Organizations"]}
      columns={["Organization", "Owner", "Members", "Projects", "Plan", "Monthly Usage"]}
      rows={[
        ["TechNova Solutions", "admin@technova.com", 42, 18, <Badge variant="info">Enterprise</Badge>, "₹4,82,500"],
        ["Voxify AI Pvt Ltd", "billing@voxify.ai", 28, 12, <Badge variant="success">Pro</Badge>, "₹3,61,200"],
        ["Global TransTech", "info@globaltranstech.com", 65, 24, <Badge variant="info">Enterprise</Badge>, "₹2,85,600"],
        ["LinguaVerse", "hello@linguaverse.com", 12, 6, <Badge variant="warning">Starter</Badge>, "₹21,890"],
        ["ChatterWise", "contact@chatterwise.ai", 22, 9, <Badge variant="success">Pro</Badge>, "₹52,410"],
        ["InnoTalk Systems", "hi@innotalk.io", 38, 15, <Badge variant="info">Enterprise</Badge>, "₹2,45,080"],
      ]}
    />
  );
}

export function Projects() {
  return (
    <GenericPage
      title="Projects"
      subtitle="All customer projects across environments."
      breadcrumb={["Customers", "Projects"]}
      columns={["Project", "Organization", "Environment", "API Keys", "Models", "Monthly Cost"]}
      rows={Array.from({ length: 12 }).map((_, i) => [
        <span className="font-medium">Project {["Alpha", "Beta", "Gamma", "Delta", "Nova", "Orion", "Vega", "Aurora", "Titan", "Nebula", "Zephyr", "Kepler"][i]}</span>,
        ["TechNova Solutions", "Voxify AI", "LinguaVerse", "ChatterWise"][i % 4],
        <Badge variant={i % 3 === 0 ? "danger" : i % 3 === 1 ? "info" : "neutral"}>{["Production", "Staging", "Development"][i % 3]}</Badge>,
        <span className="mono">{Math.floor(Math.random() * 12) + 1}</span>,
        <span className="text-muted-foreground">Paluku, Vinu</span>,
        `₹${(Math.random() * 50000 + 5000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
      ])}
    />
  );
}
