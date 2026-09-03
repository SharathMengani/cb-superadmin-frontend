import { ChevronRight } from "lucide-react";

export function PageHeader({ title, subtitle, breadcrumb = [], actions }) {
  return (
    <div className="page-header" data-testid="page-header">
      <div>
        {breadcrumb.length > 0 && (
          <div className="breadcrumb">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="w-3 h-3" />}
                <span className={i === breadcrumb.length - 1 ? "text-foreground" : ""}>{b}</span>
              </span>
            ))}
          </div>
        )}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, change, changeType = "up", iconBg = "bg-primary/15", iconColor = "text-primary-foreground" }) {
  return (
    <div className="stat-card" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      {change !== undefined && (
        <div className={`text-xs mt-2 flex items-center gap-1 ${changeType === "up" ? "text-emerald-400" : "text-red-400"}`}>
          {changeType === "up" ? "↑" : "↓"} {Math.abs(change)}% vs yesterday
        </div>
      )}
    </div>
  );
}

export function Badge({ variant = "neutral", children }) {
  return <span className={`badge-${variant}`}>{children}</span>;
}

export function Card({ title, subtitle, action, children, className = "" }) {
  return (
    <div className={`glass-card rounded-2xl p-5 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && <h3 className="font-semibold text-[15px]">{title}</h3>}
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon className="w-10 h-10 text-muted-foreground mb-3" />}
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{message}</p>
    </div>
  );
}
