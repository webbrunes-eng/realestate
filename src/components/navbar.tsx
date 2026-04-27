"use client";
import Link from "next/link";
import { Home, Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { LocaleToggle } from "./locale-toggle";
import type { Dict, Locale } from "@/lib/dict";

export function Navbar({ dict, locale }: { dict: Dict; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/properties?listingType=SALE", label: dict.nav.buy },
    { href: "/properties?listingType=RENT", label: dict.nav.rent },
    { href: "/agents", label: dict.nav.agents },
    { href: "/offices", label: dict.nav.offices },
    { href: "/about", label: dict.nav.about },
    { href: "/contact", label: dict.nav.contact },
  ];
  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
            <Home className="h-4 w-4" />
          </span>
          <span className="gradient-text">Brunes</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <a href="tel:+35542212121" className="btn-ghost gap-2">
            <Phone className="h-4 w-4" />
            <span className="text-sm">+355 42 21 21 21</span>
          </a>
          <LocaleToggle current={locale} />
          <ThemeToggle />
          <Link href="/list-property" className="btn-primary">{dict.nav.listProperty}</Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden btn-ghost">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white dark:bg-ink-950">
          <div className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <LocaleToggle current={locale} />
              <ThemeToggle />
              <Link href="/list-property" className="btn-primary flex-1">{dict.nav.listProperty}</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
