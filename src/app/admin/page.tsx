import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Home, Users, Inbox, Eye, TrendingUp } from "lucide-react";
import { formatPrice, timeAgo } from "@/lib/utils";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const { dict } = await getDict();
  const d = dict.admin.dashboard;
  const [propCount, activeCount, soldCount, agentCount, leadCount, newLeads, recentLeads, topViewed] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: "ACTIVE" } }),
    prisma.property.count({ where: { status: "SOLD" } }),
    prisma.agent.count(),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { property: true } }),
    prisma.property.findMany({ orderBy: { viewsCount: "desc" }, take: 5, include: { images: { take: 1 } } }),
  ]);

  const stats = [
    { label: d.totalProps, value: propCount, icon: Home, sub: `${activeCount} ${d.active} · ${soldCount} ${d.sold}`, color: "text-brand-600 bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/30 dark:to-brand-800/20" },
    { label: d.agentsLbl, value: agentCount, icon: Users, sub: d.agentsSub, color: "text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20" },
    { label: d.totalLeads, value: leadCount, icon: Inbox, sub: `${newLeads} ${d.unread}`, color: "text-accent-600 bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/30 dark:to-accent-800/20" },
    { label: d.growth, value: "+12%", icon: TrendingUp, sub: d.thisMonth, color: "text-gold-600 bg-gradient-to-br from-amber-50 to-gold-100 dark:from-amber-900/30 dark:to-gold-800/20" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">{d.title}</h1>
        <p className="text-ink-500">{d.welcome}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-6 hover:-translate-y-0.5 hover:shadow-card-lg transition-all">
            <div className={`grid h-11 w-11 place-items-center rounded-xl ${s.color} mb-4`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="font-display text-3xl font-bold">{s.value}</div>
            <div className="text-sm font-medium mt-1">{s.label}</div>
            <div className="text-xs text-ink-500 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{d.recentLeads}</h2>
            <Link href="/admin/leads" className="text-xs text-brand-600 hover:underline">{d.viewAll}</Link>
          </div>
          <div className="space-y-3">
            {recentLeads.map((l) => (
              <div key={l.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-100 to-accent-100 dark:from-brand-900/30 dark:to-accent-900/30 text-sm font-semibold">
                  {l.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{l.name}</p>
                    {l.status === "NEW" && <span className="chip bg-brand-100 text-brand-700 text-[10px]">NEW</span>}
                  </div>
                  <p className="text-xs text-ink-500 truncate">{l.property?.title ?? d.generalInq}</p>
                  <p className="text-[11px] text-ink-400 mt-0.5">{timeAgo(l.createdAt)}</p>
                </div>
              </div>
            ))}
            {recentLeads.length === 0 && <p className="text-sm text-ink-500">{d.noLeads}</p>}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{d.topViewed}</h2>
            <Link href="/admin/properties" className="text-xs text-brand-600 hover:underline">{d.viewAll}</Link>
          </div>
          <div className="space-y-3">
            {topViewed.map((p) => (
              <Link key={p.id} href={`/admin/properties/${p.id}`} className="flex items-center gap-3 pb-3 border-b last:border-0 hover:bg-ink-50 dark:hover:bg-ink-900 -mx-2 px-2 rounded">
                <div className="h-12 w-16 rounded-md overflow-hidden bg-ink-100 dark:bg-ink-800 flex-shrink-0">
                  {p.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{p.title}</p>
                  <p className="text-xs text-ink-500">{p.city} · {formatPrice(p.price, p.currency, p.listingType)}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-ink-500">
                  <Eye className="h-3 w-3" /> {p.viewsCount}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
