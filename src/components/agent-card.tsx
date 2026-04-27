import Image from "next/image";
import Link from "next/link";
import { Star, Phone } from "lucide-react";

type AgentDict = { sold: string; officeSuffix: string };
type Props = {
  agent: {
    id: string;
    title: string;
    photo: string | null;
    rating: number;
    soldCount: number;
    languages: string[];
    user: { name: string; phone: string | null };
    office?: { city: string } | null;
  };
  dict?: AgentDict;
};

export function AgentCard({ agent, dict }: Props) {
  const t = dict ?? { sold: "sold", officeSuffix: "office" };
  return (
    <Link href={`/agents/${agent.id}`} className="card p-5 group hover:-translate-y-1 hover:shadow-xl transition-all">
      <div className="relative mx-auto h-28 w-28 rounded-full overflow-hidden ring-4 ring-brand-100 dark:ring-ink-800 group-hover:ring-brand-500 transition">
        <Image
          src={agent.photo ?? "https://i.pravatar.cc/200"}
          alt={agent.user.name}
          fill
          sizes="120px"
          className="object-cover"
        />
      </div>
      <div className="mt-4 text-center space-y-1">
        <h3 className="font-semibold text-lg group-hover:text-brand-600 transition-colors">{agent.user.name}</h3>
        <p className="text-xs text-ink-500">{agent.title}</p>
        <div className="flex items-center justify-center gap-1 pt-1 text-sm">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold">{agent.rating.toFixed(1)}</span>
          <span className="text-ink-500">· {agent.soldCount} {t.sold}</span>
        </div>
        {agent.office && <p className="text-xs text-ink-500">{agent.office.city} {t.officeSuffix}</p>}
        <div className="flex flex-wrap justify-center gap-1 pt-2">
          {agent.languages.slice(0, 3).map((l) => (
            <span key={l} className="chip text-[10px]">{l}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
