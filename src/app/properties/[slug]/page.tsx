import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Maximize, MapPin, Calendar, Layers, Eye, Share2, Heart } from "lucide-react";
import { formatPrice, formatArea } from "@/lib/utils";
import { ContactAgentForm } from "@/components/contact-agent-form";
import { MortgageCalculator } from "@/components/mortgage-calculator";
import { PropertyCard } from "@/components/property-card";
import PropertyMap from "@/components/property-map-client";
import { getDict } from "@/lib/i18n";

export default async function PropertyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { dict } = await getDict();
  const { slug } = await params;
  const property = await prisma.property.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { orderIndex: "asc" } },
      amenities: { include: { amenity: true } },
      agent: { include: { user: true, office: true } },
      office: true,
    },
  });

  if (!property) notFound();

  await prisma.property.update({
    where: { id: property.id },
    data: { viewsCount: { increment: 1 } },
  });

  const similar = await prisma.property.findMany({
    where: {
      id: { not: property.id },
      city: property.city,
      type: property.type,
      status: "ACTIVE",
    },
    take: 3,
    include: { images: { take: 1, orderBy: { orderIndex: "asc" } } },
  });

  return (
    <div className="container py-8">
      <div className="flex gap-2 text-xs text-ink-500 mb-4">
        <Link href="/" className="hover:text-brand-600">{dict.propertyDetail.breadcrumb.home}</Link>/
        <Link href="/properties" className="hover:text-brand-600">{dict.propertyDetail.breadcrumb.properties}</Link>/
        <span className="text-ink-700 dark:text-ink-300">{property.title}</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex gap-2 mb-2">
            <span className="chip bg-gradient-to-r from-brand-500 to-brand-700 text-white">
              {property.listingType === "RENT" ? dict.propertyDetail.forRent : dict.propertyDetail.forSale}
            </span>
            <span className="chip">{property.type}</span>
            {property.featured && <span className="chip bg-gradient-to-r from-gold-500 to-accent-500 text-white">★ {dict.propertyCard.featured}</span>}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">{property.title}</h1>
          <p className="flex items-center gap-1 text-ink-500 mt-2">
            <MapPin className="h-4 w-4" /> {property.address}, {property.neighborhood}, {property.city}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl md:text-4xl font-bold gradient-text">
            {formatPrice(property.price as any, property.currency, property.listingType)}
          </p>
          <p className="text-sm text-ink-500 mt-1">{formatArea(property.areaM2)}</p>
          <div className="flex gap-2 mt-3 justify-end">
            <button className="btn-secondary"><Heart className="h-4 w-4" /> {dict.propertyDetail.save}</button>
            <button className="btn-secondary"><Share2 className="h-4 w-4" /> {dict.propertyDetail.share}</button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-3 h-[500px] mb-10">
        {property.images.slice(0, 5).map((img, i) => (
          <div
            key={img.id}
            className={`relative rounded-2xl overflow-hidden ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
          >
            <Image
              src={img.url}
              alt=""
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-500"
              unoptimized={img.url.startsWith("/uploads/")}
            />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { Icon: Bed, label: dict.propertyDetail.specs.rooms, value: property.rooms ?? "—" },
              { Icon: Bath, label: dict.propertyDetail.specs.baths, value: property.bathrooms ?? "—" },
              { Icon: Maximize, label: dict.propertyDetail.specs.area, value: `${property.areaM2}m²` },
              { Icon: Layers, label: dict.propertyDetail.specs.floor, value: property.floor ?? "—" },
              { Icon: Calendar, label: dict.propertyDetail.specs.year, value: property.yearBuilt ?? "—" },
            ].map((s) => (
              <div key={s.label} className="card p-4 text-center hover:-translate-y-0.5 hover:shadow-card-lg transition-all">
                <s.Icon className="h-5 w-5 mx-auto text-brand-600 mb-2" />
                <p className="text-xs text-ink-500">{s.label}</p>
                <p className="font-semibold">{s.value}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">{dict.propertyDetail.about}</h2>
            <p className="text-ink-600 dark:text-ink-400 leading-relaxed">{property.description}</p>
          </div>

          {property.amenities.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-4">{dict.propertyDetail.amenities}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((pa) => (
                  <div key={pa.amenityId} className="flex items-center gap-2 card p-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600">
                      ✓
                    </span>
                    <span className="text-sm font-medium">{pa.amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="font-display text-2xl font-bold mb-4">{dict.propertyDetail.location}</h2>
            <PropertyMap
              properties={[{
                id: property.id, slug: property.slug, title: property.title,
                price: property.price, currency: property.currency, listingType: property.listingType,
                lat: property.lat, lng: property.lng,
              }]}
              center={[property.lat, property.lng]}
              zoom={14}
              height="400px"
            />
          </div>

          {property.listingType === "SALE" && !property.priceOnRequest && (
            <MortgageCalculator price={Number(property.price)} dict={dict.mortgage} />
          )}

          {similar.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-4">{dict.propertyDetail.similar}</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                {similar.map((p) => <PropertyCard key={p.id} property={p as any} dict={dict.propertyCard} />)}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <div className="card p-6 sticky top-20">
            <div className="flex items-center gap-3">
              <Image
                src={property.agent.photo ?? "https://i.pravatar.cc/100"}
                alt={property.agent.user.name}
                width={56}
                height={56}
                className="rounded-full ring-2 ring-brand-100"
              />
              <div>
                <Link href={`/agents/${property.agent.id}`} className="font-semibold hover:text-brand-600">
                  {property.agent.user.name}
                </Link>
                <p className="text-xs text-ink-500">{property.agent.title}</p>
                {property.agent.user.phone && (
                  <a href={`tel:${property.agent.user.phone}`} className="text-xs text-brand-600 hover:underline">
                    {property.agent.user.phone}
                  </a>
                )}
              </div>
            </div>
          </div>

          <ContactAgentForm propertyId={property.id} agentId={property.agentId} dict={dict.contact} />

          <div className="flex items-center justify-center gap-2 text-xs text-ink-500">
            <Eye className="h-3.5 w-3.5" /> {property.viewsCount} {dict.propertyDetail.views}
          </div>
        </aside>
      </div>
    </div>
  );
}
