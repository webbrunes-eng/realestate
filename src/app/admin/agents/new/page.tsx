import { prisma } from "@/lib/prisma";
import { AgentForm } from "@/components/admin/agent-form";

export default async function NewAgentPage() {
  const offices = await prisma.office.findMany({ orderBy: { city: "asc" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">New Agent</h1>
        <p className="text-ink-500">Add a new team member.</p>
      </div>
      <AgentForm offices={offices} />
    </div>
  );
}
