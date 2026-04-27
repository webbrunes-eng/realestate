import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PropertyForm } from "@/components/admin/property-form";
import { getDict } from "@/lib/i18n";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { dict } = await getDict();
  const { id } = await params;
  const [property, agents] = await Promise.all([
    prisma.property.findUnique({ where: { id }, include: { images: { orderBy: { orderIndex: "asc" } } } }),
    prisma.agent.findMany({ include: { user: true }, orderBy: { user: { name: "asc" } } }),
  ]);
  if (!property) notFound();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">{dict.admin.properties.editTitle}</h1>
        <p className="text-ink-500">{property.title}</p>
      </div>
      <PropertyForm property={property as any} agents={agents} dict={dict.admin.form} />
    </div>
  );
}
