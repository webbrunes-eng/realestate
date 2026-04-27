"use client";
import { useRouter, useSearchParams } from "next/navigation";

type SortDict = { newest: string; priceAsc: string; priceDesc: string; areaDesc: string };

export function SortSelect({ dict }: { dict?: SortDict }) {
  const t = dict ?? {
    newest: "Newest",
    priceAsc: "Price: Low to High",
    priceDesc: "Price: High to Low",
    areaDesc: "Largest first",
  };
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("sort") ?? "newest";

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const p = new URLSearchParams(params.toString());
    p.set("sort", e.target.value);
    router.push(`/properties?${p.toString()}`);
  }

  return (
    <select value={current} onChange={onChange} className="input py-2 text-sm w-auto">
      <option value="newest">{t.newest}</option>
      <option value="price-asc">{t.priceAsc}</option>
      <option value="price-desc">{t.priceDesc}</option>
      <option value="area-desc">{t.areaDesc}</option>
    </select>
  );
}
