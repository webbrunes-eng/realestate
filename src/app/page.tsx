import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/hero";
import { PropertyCard } from "@/components/property-card";
import { AgentCard } from "@/components/agent-card";
import { prisma } from "@/lib/prisma";
import { getDict } from "@/lib/i18n";
import { ArrowRight, Quote, Shield, Trophy, Users, Building2 } from "lucide-react";

export const revalidate = 300;

export default async function HomePage() {
  const { dict, locale } = await getDict();
  const [featured, agents, cityCounts] = await Promise.all([
    prisma.property.findMany({
      where: { featured: true, status: "ACTIVE" },
      take: 8,
      include: { images: { orderBy: { orderIndex: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.agent.findMany({
      where: { featured: true },
      take: 6,
      include: { user: true, office: true },
    }),
    prisma.property.groupBy({
      by: ["city"],
      _count: { _all: true },
    }),
  ]);

  const cityImages: Record<string, string> = {
    Tirana: "https://images.unsplash.com/photo-1601132359864-c974e79890ac?w=800&q=80",
    Durrës: "https://images.unsplash.com/photo-1578589318433-39bf57ce09da?w=800&q=80",
    Vlorë: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    Sarandë: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
    Shkodër: "https://images.unsplash.com/photo-1596306499317-8490232e4c8b?w=800&q=80",
    Pogradec: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80",
  };

  const whyIcons = [Shield, Users, Trophy, Building2];
  const whyItems = [
    dict.home.why.verified,
    dict.home.why.experts,
    dict.home.why.awards,
    dict.home.why.reach,
  ];

  return (
    <>
      <Hero dict={dict} />

      <section className="section">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-2">{dict.home.destinationsLabel}</p>
              <h2 className="heading">{dict.home.destinationsTitle}</h2>
            </div>
            <Link href="/properties" className="hidden md:flex btn-ghost gap-2">
              {dict.home.allProperties} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cityCounts.map((c) => (
              <Link
                key={c.city}
                href={`/properties?city=${encodeURIComponent(c.city)}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-card"
              >
                <Image
                  src={cityImages[c.city] ?? "https://picsum.photos/600/800"}
                  alt={c.city}
                  fill
                  sizes="(max-width:768px) 50vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-display text-xl font-bold">{c.city}</h3>
                  <p className="text-xs text-white/80">{c._count._all} {dict.home.propsIn}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ink-50 dark:bg-ink-950/50">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-2">{dict.home.featuredLabel}</p>
              <h2 className="heading">{dict.home.featuredTitle}</h2>
              <p className="subheading mt-3">{dict.home.featuredSub}</p>
            </div>
            <Link href="/properties" className="hidden md:flex btn-secondary gap-2">
              {dict.home.viewAll} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => <PropertyCard key={p.id} property={p as any} dict={dict.propertyCard} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-2">{dict.home.whyLabel}</p>
            <h2 className="heading">{dict.home.whyTitle}</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {whyItems.map((f, i) => {
              const Icon = whyIcons[i];
              return (
                <div key={f.t} className="card p-6 hover:border-brand-500 hover:shadow-card-lg transition-all hover:-translate-y-1">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 dark:from-brand-900/30 dark:to-brand-800/20 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{f.t}</h3>
                  <p className="text-sm text-ink-500">{f.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-gradient-to-b from-brand-50/50 to-transparent dark:from-brand-900/5">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-2">{dict.home.agentsLabel}</p>
              <h2 className="heading">{dict.home.agentsTitle}</h2>
            </div>
            <Link href="/agents" className="hidden md:flex btn-secondary gap-2">
              {dict.home.allAgents} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {agents.map((a) => <AgentCard key={a.id} agent={a as any} dict={dict.agents} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            {dict.home.testimonials.map((t) => (
              <div key={t.name} className="card p-8 hover:shadow-card-lg transition-shadow">
                <Quote className="h-8 w-8 text-brand-500/30 mb-3" />
                <p className="text-ink-700 dark:text-ink-300 leading-relaxed">"{t.quote}"</p>
                <div className="mt-6 pt-6 border-t">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-ink-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-accent-700 p-12 md:p-20 text-white">
          <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-20" />
          <div className="blob bg-gold-400/30 h-80 w-80 -right-10 -top-10" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-4xl md:text-5xl font-bold">{dict.home.ctaTitle}</h2>
            <p className="mt-4 text-lg text-white/90">{dict.home.ctaSub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/list-property" className="btn bg-white text-brand-700 hover:bg-white/90">
                {dict.home.ctaPrimary}
              </Link>
              <Link href="/contact" className="btn border-2 border-white/40 hover:bg-white/10">
                {dict.home.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
