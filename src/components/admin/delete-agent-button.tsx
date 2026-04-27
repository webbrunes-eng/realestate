"use client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteAgentButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function del() {
    if (!confirm("Delete this agent? Their listings will become unassigned.")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/agents/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) router.refresh();
    else alert("Delete failed — this agent may have active properties");
  }
  return (
    <button onClick={del} disabled={loading} className="btn-secondary !px-3 text-red-600">
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
