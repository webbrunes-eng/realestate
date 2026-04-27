import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Eye, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { DeletePropertyButton } from "@/components/admin/delete-property-button";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const { dict } = await getDict();
  const t = dict.admin.properties;
  const properties = await prisma.property.findMany({
    include: {
      images: { take: 1, orderBy: { orderIndex: "asc" } },
      agent: { include: { user: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">{t.title}</h1>
          <p className="text-ink-500">{properties.length} {t.totalListings}</p>
        </div>
        <Link href="/admin/properties/new" className="btn-primary">
          <Plus className="h-4 w-4" /> {t.add}
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 dark:bg-ink-950 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">{t.property}</th>
                <th className="text-left px-5 py-3 font-semibold">{t.location}</th>
                <th className="text-left px-5 py-3 font-semibold">{t.price}</th>
                <th className="text-left px-5 py-3 font-semibold">{t.status}</th>
                <th className="text-left px-5 py-3 font-semibold">{t.agent}</th>
                <th className="text-left px-5 py-3 font-semibold">{t.views}</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-ink-50 dark:hover:bg-ink-950/50 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 rounded-md overflow-hidden bg-ink-100 dark:bg-ink-800 flex-shrink-0">
                        {p.images[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-medium line-clamp-1">
                          {p.featured && <Star className="h-3 w-3 fill-amber-400 text-amber-400 flex-shrink-0" />}
                          {p.title}
                        </div>
                        <div className="text-xs text-ink-500">{p.type} · {p.listingType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink-600 dark:text-ink-400">{p.neighborhood}, {p.city}</td>
                  <td className="px-5 py-3 font-semibold">{formatPrice(p.price, p.currency, p.listingType)}</td>
                  <td className="px-5 py-3">
                    <span className={`chip text-[10px] ${
                      p.status === "ACTIVE" ? "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300" :
                      p.status === "SOLD" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" :
                      p.status === "PENDING" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" :
                      "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300"
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-3 text-ink-600 dark:text-ink-400">{p.agent.user.name}</td>
                  <td className="px-5 py-3 text-ink-500"><span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> {p.viewsCount}</span></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link href={`/properties/${p.slug}`} target="_blank" className="btn-ghost !p-2" title="View">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link href={`/admin/properties/${p.id}`} className="btn-ghost !p-2" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeletePropertyButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
