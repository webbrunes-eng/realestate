import { prisma } from "@/lib/prisma";
import { AgentCard } from "@/components/agent-card";
import { getDict } from "@/lib/i18n";

export default async function AgentsPage() {
  const { dict } = await getDict();
  const agents = await prisma.agent.findMany({
    include: { user: true, office: true },
    orderBy: [{ featured: "desc" }, { rating: "desc" }],
  });

  return (
    <div className="container py-12">
      <div className="mb-12">
        <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-2">{dict.agents.label}</p>
        <h1 className="heading">{dict.agents.title}</h1>
        <p className="subheading mt-3">{dict.agents.subtitle}</p>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {agents.map((a) => <AgentCard key={a.id} agent={a as any} dict={dict.agents} />)}
      </div>
    </div>
  );
}
