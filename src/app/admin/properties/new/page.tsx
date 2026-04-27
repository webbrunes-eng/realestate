import { prisma } from "@/lib/prisma";
import { PropertyForm } from "@/components/admin/property-form";
import { getDict } from "@/lib/i18n";

export default async function NewPropertyPage() {
  const { dict } = await getDict();
  const agents = await prisma.agent.findMany({ include: { user: true }, orderBy: { user: { name: "asc" } } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">{dict.admin.properties.newTitle}</h1>
        <p className="text-ink-500">{dict.admin.properties.newSub}</p>
      </div>
      <PropertyForm agents={agents} dict={dict.admin.form} />
    </div>
  );
}
