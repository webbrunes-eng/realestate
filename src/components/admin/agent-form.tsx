"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

type Office = { id: string; name: string; city: string };
type Agent = {
  id?: string;
  title?: string;
  bio?: string | null;
  photo?: string | null;
  languages?: string[];
  rating?: number;
  soldCount?: number;
  featured?: boolean;
  officeId?: string | null;
  user?: { name: string; email: string; phone: string | null };
};

export function AgentForm({ agent, offices }: { agent?: Agent; offices: Office[] }) {
  const router = useRouter();
  const [f, setF] = useState<any>({
    name: agent?.user?.name ?? "",
    email: agent?.user?.email ?? "",
    phone: agent?.user?.phone ?? "",
    password: "",
    title: agent?.title ?? "Senior Agent",
    bio: agent?.bio ?? "",
    photo: agent?.photo ?? "",
    languages: (agent?.languages ?? ["English", "Albanian"]).join(", "),
    rating: agent?.rating ?? 5,
    soldCount: agent?.soldCount ?? 0,
    featured: agent?.featured ?? false,
    officeId: agent?.officeId ?? offices[0]?.id ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  function set(k: string, v: any) { setF({ ...f, [k]: v }); }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setErr("");
    const payload = {
      ...f,
      languages: f.languages.split(",").map((s: string) => s.trim()).filter(Boolean),
      rating: +f.rating,
      soldCount: +f.soldCount,
    };
    const url = agent?.id ? `/api/admin/agents/${agent.id}` : "/api/admin/agents";
    const method = agent?.id ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setLoading(false);
    if (res.ok) { router.push("/admin/agents"); router.refresh(); }
    else {
      const d = await res.json().catch(() => ({}));
      setErr(d.error ?? "Save failed");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      {err && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{err}</div>}

      <div className="card p-6 space-y-4">
        <h2 className="font-semibold">Personal info</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Full name</label>
            <input required className="input mt-1" value={f.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Email</label>
            <input required type="email" className="input mt-1" value={f.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Phone</label>
            <input className="input mt-1" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
              Password {agent?.id && <span className="text-ink-400 normal-case">(leave blank to keep)</span>}
            </label>
            <input type="password" className="input mt-1" value={f.password} onChange={(e) => set("password", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Photo URL</label>
            <input className="input mt-1" placeholder="https://..." value={f.photo} onChange={(e) => set("photo", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="font-semibold">Professional</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Title</label>
            <select className="input mt-1" value={f.title} onChange={(e) => set("title", e.target.value)}>
              <option>Senior Agent</option><option>Partner Agent</option>
              <option>Lead Broker</option><option>Assistant Agent</option><option>Associate</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Office</label>
            <select className="input mt-1" value={f.officeId} onChange={(e) => set("officeId", e.target.value)}>
              <option value="">— None —</option>
              {offices.map((o) => <option key={o.id} value={o.id}>{o.name} ({o.city})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Languages (comma separated)</label>
            <input className="input mt-1" value={f.languages} onChange={(e) => set("languages", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Rating</label>
              <input type="number" step="0.1" min="0" max="5" className="input mt-1" value={f.rating} onChange={(e) => set("rating", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Sold</label>
              <input type="number" className="input mt-1" value={f.soldCount} onChange={(e) => set("soldCount", e.target.value)} />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Bio</label>
            <textarea rows={3} className="input mt-1 resize-none" value={f.bio} onChange={(e) => set("bio", e.target.value)} />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-brand-600" />
          <span className="text-sm font-medium">Feature on homepage</span>
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
        <button disabled={loading} className="btn-primary">
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : agent?.id ? "Update agent" : "Create agent"}
        </button>
      </div>
    </form>
  );
}
