import { PageHeader, Card, Badge } from "@/components/PageChrome";
import { Construction, Filter, Download, Plus } from "lucide-react";

/**
 * Generic page template used for screens where the primary UI is a filtered table
 * or a set of cards. Populate `columns`, `rows`, `stats` and `filters` for a real look.
 */
export default function GenericPage({
  title, subtitle, breadcrumb, stats = [], columns = [], rows = [], filters = [], actions,
  cards, cta = "Add New", showAdd = false,
}) {
  return (
    <div className="space-y-6" data-testid={`page-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumb={breadcrumb}
        actions={
          <div className="flex items-center gap-2">
            {actions}
            {showAdd && (
              <button className="h-9 px-4 rounded-lg btn-gradient text-xs font-medium flex items-center gap-2">
                <Plus className="w-3.5 h-3.5" /> {cta}
              </button>
            )}
          </div>
        }
      />

      {stats.length > 0 && (
        <div className={`grid grid-cols-2 md:grid-cols-${Math.min(stats.length, 4)} gap-4`}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-semibold mt-1">{s.value}</div>
              {s.change && <div className={`text-xs mt-1.5 ${s.change > 0 ? "text-emerald-400" : "text-red-400"}`}>
                {s.change > 0 ? "↑" : "↓"} {Math.abs(s.change)}% vs last period
              </div>}
            </div>
          ))}
        </div>
      )}

      {cards && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cards.map((c, i) => (
            <Card key={i} title={c.title} subtitle={c.subtitle}>
              {c.content || <div className="text-sm text-muted-foreground">{c.description}</div>}
              {c.footer && <div className="mt-3 pt-3 border-t border-border text-xs">{c.footer}</div>}
            </Card>
          ))}
        </div>
      )}

      {rows.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          {filters.length > 0 && (
            <div className="p-4 border-b border-border flex items-center gap-2 flex-wrap">
              {filters.map((f, i) => (
                <select key={i} className="h-9 px-3 rounded-lg bg-secondary/60 border border-border text-xs">
                  <option>{f}</option>
                </select>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <button className="h-9 px-3 rounded-lg bg-secondary/60 border border-border text-xs flex items-center gap-1.5">
                  <Filter className="w-3 h-3" /> More
                </button>
                <button className="h-9 px-3 rounded-lg bg-secondary/60 border border-border text-xs flex items-center gap-1.5">
                  <Download className="w-3 h-3" /> Export
                </button>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {columns.map((c, i) => (
                    <th key={i} className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b border-border/60 table-row-hover">
                    {r.map((cell, j) => (
                      <td key={j} className="px-4 py-3 text-xs">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {rows.length === 0 && !cards && stats.length === 0 && (
        <div className="glass-card rounded-2xl p-16 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mb-4">
            <Construction className="w-7 h-7 text-primary-foreground" />
          </div>
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-md">{subtitle || "This screen is scaffolded and ready for detailed data wiring."}</p>
        </div>
      )}
    </div>
  );
}
