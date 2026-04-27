import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { DeleteAgentButton } from "@/components/admin/delete-agent-button";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AdminAgentsPage() {
  const { dict } = await getDict();
  const t = dict.admin.agentsPage;
  const agents = await prisma.agent.findMany({
    include: { user: true, office: true, _count: { select: { properties: true } } },
    orderBy: [{ featured: "desc" }, { rating: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">{t.title}</h1>
          <p className="text-ink-500">{agents.length} {t.licensed}</p>
        </div>
        <Link href="/admin/agents/new" className="btn-primary">
          <Plus className="h-4 w-4" /> {t.add}
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((a) => (
          <div key={a.id} className="card p-5">
            <div className="flex items-start gap-3">
              <div className="h-14 w-14 rounded-full overflow-hidden bg-ink-100 dark:bg-ink-800 flex-shrink-0">
                {a.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.photo} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold truncate flex items-center gap-1">
                      {a.featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                      {a.user.name}
                    </p>
                    <p className="text-xs text-ink-500">{a.title}</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-ink-500 space-y-0.5">
                  <div>📧 {a.user.email}</div>
                  {a.office && <div>📍 {a.office.city}</div>}
                  <div>🏠 {a._count.properties} · ⭐ {a.rating.toFixed(1)}</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Link href={`/admin/agents/${a.id}`} className="btn-secondary flex-1">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <DeleteAgentButton id={a.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
