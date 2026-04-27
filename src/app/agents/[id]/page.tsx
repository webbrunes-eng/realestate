import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, Phone, Mail, MapPin, Award } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { ContactAgentForm } from "@/components/contact-agent-form";
import { getDict } from "@/lib/i18n";

export default async function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { dict } = await getDict();
  const { id } = await params;
  const agent = await prisma.agent.findUnique({
    where: { id },
    include: {
      user: true,
      office: true,
      properties: {
        where: { status: "ACTIVE" },
        include: { images: { take: 1, orderBy: { orderIndex: "asc" } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!agent) notFound();

  return (
    <div className="container py-10">
      <div className="card p-8 md:p-10">
        <div className="grid md:grid-cols-[200px_1fr_320px] gap-8 items-start">
          <div className="relative aspect-square rounded-2xl overflow-hidden ring-4 ring-brand-100 dark:ring-ink-800">
            <Image src={agent.photo ?? "https://i.pravatar.cc/400"} alt={agent.user.name} fill sizes="200px" className="object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider">{agent.title}</p>
            <h1 className="font-display text-4xl font-bold mt-1">{agent.user.name}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{agent.rating.toFixed(1)}</span>
              </span>
              <span className="text-ink-500">· {agent.soldCount} {dict.agents.sold}</span>
              {agent.office && (
                <span className="flex items-center gap-1 text-ink-500">
                  <MapPin className="h-3.5 w-3.5" /> {agent.office.city}
                </span>
              )}
            </div>
            {agent.bio && <p className="mt-5 text-ink-600 dark:text-ink-400 leading-relaxed">{agent.bio}</p>}
            <div className="flex flex-wrap gap-2 mt-4">
              {agent.languages.map((l) => <span key={l} className="chip">{l}</span>)}
            </div>
            <div className="flex gap-2 mt-6">
              {agent.user.phone && (
                <a href={`tel:${agent.user.phone}`} className="btn-primary"><Phone className="h-4 w-4" /> {dict.agents.call}</a>
              )}
              <a href={`mailto:${agent.user.email}`} className="btn-secondary"><Mail className="h-4 w-4" /> {dict.agents.email}</a>
            </div>
          </div>
          <ContactAgentForm agentId={agent.id} dict={dict.contact} />
        </div>
      </div>

      {agent.properties.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            <Award className="h-5 w-5 text-brand-600" /> {dict.agents.activeListings} ({agent.properties.length})
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {agent.properties.map((p) => <PropertyCard key={p.id} property={p as any} dict={dict.propertyCard} />)}
          </div>
        </div>
      )}
    </div>
  );
}
