import { ContactAgentForm } from "@/components/contact-agent-form";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getDict } from "@/lib/i18n";

export default async function ContactPage() {
  const { dict } = await getDict();
  return (
    <div className="container py-16">
      <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
        <div>
          <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-2">{dict.contact.pageLabel}</p>
          <h1 className="heading mb-4">{dict.contact.pageTitle}</h1>
          <p className="subheading mb-10">{dict.contact.pageSub}</p>
          <div className="space-y-5">
            {[
              { Icon: Phone, label: dict.contact.phoneLbl, value: "+355 42 21 21 21" },
              { Icon: Mail, label: dict.contact.emailLbl, value: "hello@brunes.al" },
              { Icon: MapPin, label: dict.contact.headOffice, value: "Rruga e Kavajës 116, Tirana 1001" },
              { Icon: Clock, label: dict.contact.hours, value: "Mon–Fri 9:00–18:00, Sat 10:00–14:00" },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/30 dark:to-brand-800/20 text-brand-600">
                  <c.Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-ink-500 uppercase tracking-wide">{c.label}</p>
                  <p className="font-semibold">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <ContactAgentForm dict={dict.contact} />
        </div>
      </div>
    </div>
  );
}
