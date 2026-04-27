"use client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeletePropertyButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function del() {
    if (!confirm("Delete this property? This cannot be undone.")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) router.refresh();
    else alert("Delete failed");
  }
  return (
    <button onClick={del} disabled={loading} className="btn-ghost !p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" title="Delete">
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
