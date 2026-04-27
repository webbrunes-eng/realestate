import { prisma } from "@/lib/prisma";
import { LeadRow } from "@/components/admin/lead-row";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const { dict } = await getDict();
  const t = dict.admin.leads;
  const leads = await prisma.lead.findMany({
    include: { property: { select: { title: true, slug: true } }, agent: { include: { user: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  const counts = {
    NEW: leads.filter((l) => l.status === "NEW").length,
    CONTACTED: leads.filter((l) => l.status === "CONTACTED").length,
    QUALIFIED: leads.filter((l) => l.status === "QUALIFIED").length,
    CLOSED: leads.filter((l) => l.status === "CLOSED").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">{t.title}</h1>
        <p className="text-ink-500">{t.sub}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(counts).map(([k, v]) => (
          <div key={k} className="card p-4 hover:-translate-y-0.5 transition-transform">
            <p className="text-xs text-ink-500 uppercase tracking-wide">{k}</p>
            <p className="font-display text-2xl font-bold">{v}</p>
          </div>
        ))}
      </div>

      <div className="card divide-y">
        {leads.length === 0 && <div className="p-12 text-center text-ink-500">{t.noLeads}</div>}
        {leads.map((l) => (
          <LeadRow key={l.id} lead={l as any} dict={t} />
        ))}
      </div>
    </div>
  );
}
