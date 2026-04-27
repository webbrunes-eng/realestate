import Link from "next/link";
import { Home, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import type { Dict } from "@/lib/dict";

export function Footer({ dict }: { dict: Dict }) {
  return (
    <footer className="mt-24 border-t bg-ink-50 dark:bg-ink-950">
      <div className="container py-16 grid gap-10 md:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              <Home className="h-4 w-4" />
            </span>
            <span className="gradient-text">Brunes</span>
          </Link>
          <p className="text-sm text-ink-600 dark:text-ink-400 max-w-xs">{dict.footer.tagline}</p>
          <div className="flex gap-2">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-lg border hover:bg-brand-600 hover:text-white hover:border-brand-600 transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{dict.footer.properties}</h4>
          <ul className="space-y-2 text-sm text-ink-600 dark:text-ink-400">
            <li><Link href="/properties?type=APARTMENT" className="hover:text-brand-600">{dict.footer.apartments}</Link></li>
            <li><Link href="/properties?type=VILLA" className="hover:text-brand-600">{dict.footer.villas}</Link></li>
            <li><Link href="/properties?type=OFFICE" className="hover:text-brand-600">{dict.footer.offices}</Link></li>
            <li><Link href="/properties?type=LAND" className="hover:text-brand-600">{dict.footer.land}</Link></li>
            <li><Link href="/properties?listingType=RENT" className="hover:text-brand-600">{dict.footer.rentals}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{dict.footer.company}</h4>
          <ul className="space-y-2 text-sm text-ink-600 dark:text-ink-400">
            <li><Link href="/about" className="hover:text-brand-600">{dict.footer.aboutUs}</Link></li>
            <li><Link href="/agents" className="hover:text-brand-600">{dict.footer.ourAgents}</Link></li>
            <li><Link href="/offices" className="hover:text-brand-600">{dict.footer.offices}</Link></li>
            <li><Link href="/contact" className="hover:text-brand-600">{dict.footer.contact}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{dict.footer.contact}</h4>
          <ul className="space-y-3 text-sm text-ink-600 dark:text-ink-400">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-600" /> +355 42 21 21 21</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-600" /> hello@brunes.al</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-600" /> Tirana, Albania</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-ink-500">
          <p>© {new Date().getFullYear()} Brunes Real Estate. {dict.footer.rights}</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-brand-600">{dict.footer.privacy}</Link>
            <Link href="#" className="hover:text-brand-600">{dict.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
