"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, LogIn } from "lucide-react";
import Link from "next/link";
import { LocaleToggle } from "@/components/locale-toggle";

type AdminDict = {
  brand: string;
  welcomeBack: string;
  signInHint: string;
  email: string;
  password: string;
  signIn: string;
  signingIn: string;
  invalid: string;
  defaultHint: string;
};

export function LoginForm({ dict, locale }: { dict: AdminDict; locale: "en" | "sq" }) {
  const router = useRouter();
  const [email, setEmail] = useState("admin@brunes.al");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const { error } = await res.json().catch(() => ({}));
      setErr(error ?? dict.invalid);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-brand-50 via-white to-accent-50 dark:from-ink-950 dark:via-ink-900 dark:to-ink-950 p-6 relative overflow-hidden">
      <div className="blob bg-brand-500/30 h-96 w-96 -top-20 -left-20" />
      <div className="blob bg-accent-400/20 h-96 w-96 -bottom-20 -right-20" style={{ animationDelay: "4s" }} />
      <div className="absolute top-6 right-6 z-10">
        <LocaleToggle current={locale} />
      </div>
      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 font-display text-2xl font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
            <Lock className="h-5 w-5" />
          </span>
          <span className="gradient-text">{dict.brand}</span>
        </Link>
        <form onSubmit={submit} className="card p-8 space-y-4 shadow-card-lg">
          <div>
            <h1 className="font-display text-2xl font-bold">{dict.welcomeBack}</h1>
            <p className="text-sm text-ink-500 mt-1">{dict.signInHint}</p>
          </div>

          {err && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-400">
              {err}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{dict.email}</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" autoComplete="email" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{dict.password}</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input" autoComplete="current-password" />
          </div>

          <button disabled={loading} className="btn-primary w-full">
            <LogIn className="h-4 w-4" />
            {loading ? dict.signingIn : dict.signIn}
          </button>

          <div className="text-xs text-ink-500 text-center pt-3 border-t">
            {dict.defaultHint}: <code className="text-brand-600">admin@brunes.al</code> / <code className="text-brand-600">admin123</code>
          </div>
        </form>
      </div>
    </div>
  );
}
