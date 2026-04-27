import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { MapPin, Phone, Mail, Users } from "lucide-react";
import { getDict } from "@/lib/i18n";

export default async function OfficesPage() {
  const { dict } = await getDict();
  const offices = await prisma.office.findMany({
    include: { _count: { select: { agents: true, properties: true } } },
  });

  return (
    <div className="container py-12">
      <div className="mb-12">
        <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-2">{dict.offices.label}</p>
        <h1 className="heading">{dict.offices.title}</h1>
        <p className="subheading mt-3">{dict.offices.subtitle}</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offices.map((o) => (
          <div key={o.id} className="card overflow-hidden group hover:-translate-y-1 hover:shadow-card-lg transition-all">
            <div className="relative aspect-video">
              <Image src={o.photo ?? "https://picsum.photos/600/400"} alt={o.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent" />
              <h3 className="absolute bottom-4 left-4 right-4 font-display text-2xl font-bold text-white">{o.name}</h3>
            </div>
            <div className="p-5 space-y-3 text-sm">
              <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-brand-600 mt-0.5" /> {o.address}</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-600" /> <a href={`tel:${o.phone}`} className="hover:text-brand-600">{o.phone}</a></div>
              {o.email && <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-600" /> <a href={`mailto:${o.email}`} className="hover:text-brand-600">{o.email}</a></div>}
              <div className="pt-3 border-t flex items-center justify-between text-xs text-ink-500">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {o._count.agents} {dict.offices.agents}</span>
                <span>{o._count.properties} {dict.offices.listings}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
