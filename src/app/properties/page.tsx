import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/property-card";
import { FilterSidebar } from "@/components/filter-sidebar";
import { SortSelect } from "@/components/sort-select";
import { Prisma } from "@prisma/client";
import { getDict } from "@/lib/i18n";
import Link from "next/link";

type Search = {
  listingType?: string;
  type?: string;
  city?: string;
  priceMin?: string;
  priceMax?: string;
  rooms?: string;
  sort?: string;
  page?: string;
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { dict } = await getDict();
  const sp = await searchParams;
  const where: Prisma.PropertyWhereInput = { status: "ACTIVE" };
  if (sp.listingType === "SALE" || sp.listingType === "RENT") where.listingType = sp.listingType;
  if (sp.type) where.type = sp.type as any;
  if (sp.city) where.city = sp.city;
  if (sp.rooms) {
    const r = sp.rooms === "4+" ? 4 : parseInt(sp.rooms);
    where.rooms = sp.rooms === "4+" ? { gte: 4 } : r;
  }
  if (sp.priceMin || sp.priceMax) {
    where.price = {};
    if (sp.priceMin) (where.price as any).gte = parseFloat(sp.priceMin);
    if (sp.priceMax) (where.price as any).lte = parseFloat(sp.priceMax);
  }

  const orderBy: Prisma.PropertyOrderByWithRelationInput =
    sp.sort === "price-asc" ? { price: "asc" } :
    sp.sort === "price-desc" ? { price: "desc" } :
    sp.sort === "area-desc" ? { areaM2: "desc" } :
    { createdAt: "desc" };

  const page = parseInt(sp.page ?? "1");
  const take = 12;
  const skip = (page - 1) * take;

  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: { images: { orderBy: { orderIndex: "asc" }, take: 1 } },
      orderBy,
      take,
      skip,
    }),
    prisma.property.count({ where }),
  ]);

  const pages = Math.ceil(total / take);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="heading">{dict.properties.title}</h1>
        <p className="text-ink-500 mt-2">{total.toLocaleString()} {dict.properties.results}</p>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        <FilterSidebar dict={dict.properties.filters} />

        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-ink-500">
              {dict.properties.showing} {items.length} {dict.properties.of} {total}
            </p>
            <SortSelect dict={dict.properties.sort} />
          </div>

          {items.length === 0 ? (
            <div className="card p-16 text-center">
              <h3 className="text-xl font-semibold mb-2">{dict.properties.noResults}</h3>
              <p className="text-ink-500">{dict.properties.noResultsSub}</p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map((p) => <PropertyCard key={p.id} property={p as any} dict={dict.propertyCard} />)}
              </div>

              {pages > 1 && (
                <div className="flex justify-center gap-1 mt-12">
                  {Array.from({ length: pages }).map((_, i) => {
                    const p = new URLSearchParams();
                    Object.entries(sp).forEach(([k, v]) => v && p.set(k, v));
                    p.set("page", String(i + 1));
                    return (
                      <Link
                        key={i}
                        href={`/properties?${p.toString()}`}
                        className={`h-10 w-10 grid place-items-center rounded-lg border text-sm font-semibold ${
                          page === i + 1 ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white border-brand-600 shadow-glow" : "hover:bg-ink-100 dark:hover:bg-ink-800"
                        }`}
                      >
                        {i + 1}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
