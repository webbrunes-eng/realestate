"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Globe } from "lucide-react";

export function LocaleToggle({ current }: { current: "en" | "sq" }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  async function setLocale(locale: "en" | "sq") {
    if (locale === current || pending) return;
    setPending(true);
    document.cookie = `brunes_locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    router.refresh();
  }
  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-ink-200 dark:border-ink-700 p-0.5 text-xs font-semibold">
      <Globe className="h-3.5 w-3.5 ml-2 text-ink-400" />
      <button
        onClick={() => setLocale("en")}
        className={`px-2.5 py-1 rounded-full transition ${
          current === "en" ? "bg-brand-600 text-white" : "text-ink-500 hover:text-ink-900 dark:hover:text-ink-100"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale("sq")}
        className={`px-2.5 py-1 rounded-full transition ${
          current === "sq" ? "bg-brand-600 text-white" : "text-ink-500 hover:text-ink-900 dark:hover:text-ink-100"
        }`}
      >
        SQ
      </button>
    </div>
  );
}
