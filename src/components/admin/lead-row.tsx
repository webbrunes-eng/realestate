"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";
import { Mail, Phone, ChevronDown } from "lucide-react";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED";
  createdAt: string | Date;
  property: { title: string; slug: string } | null;
  agent: { user: { name: string } } | null;
};

const statusStyles: Record<string, string> = {
  NEW: "bg-brand-100 text-brand-700",
  CONTACTED: "bg-blue-100 text-blue-700",
  QUALIFIED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-ink-200 text-ink-700",
};

type LeadDict = { showMsg: string; hideMsg: string; re: string };

export function LeadRow({ lead, dict }: { lead: Lead; dict?: LeadDict }) {
  const t: LeadDict = dict ?? { showMsg: "Show message", hideMsg: "Hide message", re: "Re:" };
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(lead.status);

  async function updateStatus(newStatus: string) {
    setStatus(newStatus as any);
    await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  return (
    <div className="p-5 hover:bg-ink-50 dark:hover:bg-ink-950/50 transition">
      <div className="flex items-start gap-4">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-ink-100 dark:bg-ink-800 font-semibold flex-shrink-0">
          {lead.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <p className="font-semibold">{lead.name}</p>
            <span className={`chip text-[10px] ${statusStyles[status]}`}>{status}</span>
            <span className="text-xs text-ink-500 ml-auto">{timeAgo(lead.createdAt)}</span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-ink-500">
            <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-brand-600"><Mail className="h-3 w-3" /> {lead.email}</a>
            {lead.phone && <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-brand-600"><Phone className="h-3 w-3" /> {lead.phone}</a>}
          </div>
          {lead.property && (
            <p className="text-xs text-ink-500 mt-1">
              {t.re} <Link href={`/properties/${lead.property.slug}`} className="text-brand-600 hover:underline">{lead.property.title}</Link>
            </p>
          )}
          <button onClick={() => setOpen(!open)} className="mt-2 text-xs text-brand-600 hover:underline flex items-center gap-1">
            {open ? t.hideMsg : t.showMsg} <ChevronDown className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="mt-3 p-3 rounded-lg bg-ink-50 dark:bg-ink-900 text-sm">
              {lead.message}
            </div>
          )}
        </div>
        <select value={status} onChange={(e) => updateStatus(e.target.value)} className="input !w-auto text-xs">
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>
    </div>
  );
}
