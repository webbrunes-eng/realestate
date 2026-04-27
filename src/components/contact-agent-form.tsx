"use client";
import { useState, FormEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";

type ContactDict = {
  formTitle: string;
  name: string;
  email: string;
  phone: string;
  defaultMessage: string;
  send: string;
  sending: string;
  sent: string;
  sentSub: string;
};

export function ContactAgentForm({
  propertyId,
  agentId,
  dict,
}: {
  propertyId?: string;
  agentId?: string;
  dict?: ContactDict;
}) {
  const t: ContactDict = dict ?? {
    formTitle: "Contact Agent",
    name: "Your name",
    email: "Email",
    phone: "Phone (optional)",
    defaultMessage: "Hi, I'm interested in this property and would like to schedule a viewing.",
    send: "Send Message",
    sending: "Sending...",
    sent: "Message sent!",
    sentSub: "The agent will contact you shortly.",
  };
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: t.defaultMessage,
  });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, propertyId, agentId }),
    });
    setLoading(false);
    if (res.ok) setDone(true);
  }

  if (done)
    return (
      <div className="card p-8 text-center space-y-3">
        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
        <h3 className="font-semibold text-lg">{t.sent}</h3>
        <p className="text-sm text-ink-500">{t.sentSub}</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="card p-6 space-y-3">
      <h3 className="font-semibold text-lg">{t.formTitle}</h3>
      <input
        required
        placeholder={t.name}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="input"
      />
      <input
        required
        type="email"
        placeholder={t.email}
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="input"
      />
      <input
        placeholder={t.phone}
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="input"
      />
      <textarea
        required
        rows={4}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="input resize-none"
      />
      <button disabled={loading} className="btn-primary w-full">
        <Send className="h-4 w-4" />
        {loading ? t.sending : t.send}
      </button>
    </form>
  );
}
