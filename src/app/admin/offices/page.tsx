import { prisma } from "@/lib/prisma";
import { MapPin, Phone, Mail, Users } from "lucide-react";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AdminOfficesPage() {
  const { dict } = await getDict();
  const t = dict.admin.offices;
  const offices = await prisma.office.findMany({
    include: { _count: { select: { agents: true, properties: true } } },
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">{t.title}</h1>
        <p className="text-ink-500">{offices.length} {t.branches}</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offices.map((o) => (
          <div key={o.id} className="card p-5 hover:-translate-y-0.5 hover:shadow-card-lg transition-all">
            <h3 className="font-semibold text-lg">{o.name}</h3>
            <div className="mt-3 space-y-2 text-sm text-ink-600 dark:text-ink-400">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-600" /> {o.city} — {o.address}</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-600" /> {o.phone}</p>
              {o.email && <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-600" /> {o.email}</p>}
            </div>
            <div className="flex justify-between pt-4 mt-4 border-t text-xs text-ink-500">
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {o._count.agents} {dict.offices.agents}</span>
              <span>{o._count.properties} {dict.offices.listings}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
