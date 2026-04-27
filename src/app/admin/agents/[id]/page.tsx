import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AgentForm } from "@/components/admin/agent-form";

export default async function EditAgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [agent, offices] = await Promise.all([
    prisma.agent.findUnique({ where: { id }, include: { user: true } }),
    prisma.office.findMany({ orderBy: { city: "asc" } }),
  ]);
  if (!agent) notFound();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Edit Agent</h1>
        <p className="text-ink-500">{agent.user.name}</p>
      </div>
      <AgentForm agent={agent as any} offices={offices} />
    </div>
  );
}
