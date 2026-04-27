"use client";
import { Search, MapPin, Home, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import type { Dict } from "@/lib/dict";

export function Hero({ dict }: { dict: Dict }) {
  const router = useRouter();
  const [listingType, setListingType] = useState<"SALE" | "RENT">("SALE");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [priceMax, setPriceMax] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("listingType", listingType);
    if (type) params.set("type", type);
    if (city) params.set("city", city);
    if (priceMax) params.set("priceMax", priceMax);
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2400&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/60 to-ink-950/90" />
        <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-20" />
        <div className="blob bg-brand-500/40 h-80 w-80 -top-20 -left-20" />
        <div className="blob bg-accent-500/30 h-80 w-80 top-40 right-10" style={{ animationDelay: "3s" }} />
      </div>

      <div className="container pt-28 pb-24 md:pt-40 md:pb-36 text-white animate-fade-up">
        <span className="chip bg-white/10 text-white border border-white/20 backdrop-blur">
          🏆 {dict.hero.badge}
        </span>
        <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[1.05] max-w-4xl">
          {dict.hero.title1}{" "}
          <span className="gradient-text">{dict.hero.title2}</span>
        </h1>
        <p className="mt-6 text-lg text-white/80 max-w-xl">{dict.hero.subtitle}</p>

        <form
          onSubmit={submit}
          className="mt-10 max-w-4xl rounded-2xl bg-white/95 dark:bg-ink-900/95 p-2 shadow-2xl backdrop-blur"
        >
          <div className="flex gap-1 p-1 border-b">
            {(["SALE", "RENT"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setListingType(v)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
                  listingType === v
                    ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow"
                    : "text-ink-600 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800"
                }`}
              >
                {v === "SALE" ? dict.hero.buy : dict.hero.rent}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-[1.3fr_1fr_1fr_auto] gap-2 p-2">
            <label className="flex items-center gap-2 px-3">
              <MapPin className="h-4 w-4 text-brand-600" />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent py-3 text-sm text-ink-900 dark:text-ink-100 placeholder:text-ink-400 focus:outline-none"
                placeholder={dict.hero.location}
              />
            </label>
            <label className="flex items-center gap-2 px-3 border-l border-ink-200 dark:border-ink-700">
              <Home className="h-4 w-4 text-brand-600" />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-transparent py-3 text-sm text-ink-900 dark:text-ink-100 focus:outline-none"
              >
                <option value="">{dict.hero.anyType}</option>
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="DUPLEX">Duplex</option>
                <option value="OFFICE">Office</option>
                <option value="SHOP">Shop</option>
                <option value="LAND">Land</option>
              </select>
            </label>
            <label className="flex items-center gap-2 px-3 border-l border-ink-200 dark:border-ink-700">
              <Building2 className="h-4 w-4 text-brand-600" />
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full bg-transparent py-3 text-sm text-ink-900 dark:text-ink-100 placeholder:text-ink-400 focus:outline-none"
                placeholder={dict.hero.maxPrice}
              />
            </label>
            <button type="submit" className="btn-primary px-6">
              <Search className="h-4 w-4" /> {dict.hero.search}
            </button>
          </div>
        </form>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
          {[
            { n: "8,500+", l: dict.hero.stats.listings },
            { n: "440+", l: dict.hero.stats.agents },
            { n: "47", l: dict.hero.stats.offices },
            { n: "15K+", l: dict.hero.stats.clients },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-3xl md:text-4xl font-bold">{s.n}</div>
              <div className="text-sm text-white/70 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
