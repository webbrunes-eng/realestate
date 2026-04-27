import { getDict } from "@/lib/i18n";

export default async function AboutPage() {
  const { dict } = await getDict();
  return (
    <div className="container py-16 max-w-4xl">
      <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-2">{dict.about.label}</p>
      <h1 className="heading mb-6">{dict.about.title}</h1>
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-ink-600 dark:text-ink-400">
        <p className="text-xl leading-relaxed">{dict.about.p1}</p>
        <p>{dict.about.p2}</p>
        <p>{dict.about.p3}</p>
        <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-ink-100 pt-6">{dict.about.valuesTitle}</h2>
        <ul className="space-y-3">
          {dict.about.values.map((v, i) => {
            const [bold, ...rest] = v.split(".");
            return (
              <li key={i}>
                <strong>{bold}.</strong> {rest.join(".").trim()}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
