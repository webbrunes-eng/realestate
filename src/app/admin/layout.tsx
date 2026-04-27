import Link from "next/link";
import { LayoutDashboard, Home, Users, Building2, Inbox, Lock } from "lucide-react";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { LocaleToggle } from "@/components/locale-toggle";
import { getDict } from "@/lib/i18n";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const { dict, locale } = await getDict();
  const t = dict.admin;

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      {session?.role === "ADMIN" ? (
        <div className="grid grid-cols-[260px_1fr] min-h-screen">
          <aside className="border-r bg-white dark:bg-ink-900 flex flex-col">
            <Link href="/admin" className="flex items-center gap-2 px-6 h-16 border-b font-display text-lg font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
                <Lock className="h-4 w-4" />
              </span>
              <span className="gradient-text">{t.brand}</span>
            </Link>
            <nav className="p-3 space-y-1">
              {[
                { href: "/admin", icon: LayoutDashboard, label: t.nav.dashboard },
                { href: "/admin/properties", icon: Home, label: t.nav.properties },
                { href: "/admin/agents", icon: Users, label: t.nav.agents },
                { href: "/admin/offices", icon: Building2, label: t.nav.offices },
                { href: "/admin/leads", icon: Inbox, label: t.nav.leads },
              ].map((i) => (
                <Link
                  key={i.href}
                  href={i.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
                >
                  <i.icon className="h-4 w-4" />
                  {i.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto p-3 border-t space-y-2">
              <div className="px-1 pb-1">
                <LocaleToggle current={locale} />
              </div>
              <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-ink-100 dark:hover:bg-ink-800">
                {t.backToSite}
              </Link>
              <LogoutButton label={t.logout} />
              <div className="px-3 pt-2 text-xs text-ink-500">{session.email}</div>
            </div>
          </aside>
          <main className="p-8 overflow-auto">{children}</main>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
