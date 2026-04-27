"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";

type FilterDict = {
  title: string;
  clear: string;
  all: string;
  buy: string;
  rent: string;
  type: string;
  any: string;
  city: string;
  allCities: string;
  priceRange: string;
  min: string;
  max: string;
  rooms: string;
  apply: string;
};

export function FilterSidebar({ dict }: { dict?: FilterDict }) {
  const t: FilterDict = dict ?? {
    title: "Filters", clear: "Clear", all: "All", buy: "Buy", rent: "Rent",
    type: "Property Type", any: "Any", city: "City", allCities: "All cities",
    priceRange: "Price Range (EUR)", min: "Min", max: "Max", rooms: "Rooms", apply: "Apply Filters",
  };
  const router = useRouter();
  const params = useSearchParams();
  const [listingType, setListingType] = useState(params.get("listingType") ?? "");
  const [type, setType] = useState(params.get("type") ?? "");
  const [city, setCity] = useState(params.get("city") ?? "");
  const [priceMin, setPriceMin] = useState(params.get("priceMin") ?? "");
  const [priceMax, setPriceMax] = useState(params.get("priceMax") ?? "");
  const [rooms, setRooms] = useState(params.get("rooms") ?? "");

  useEffect(() => {
    setListingType(params.get("listingType") ?? "");
    setType(params.get("type") ?? "");
    setCity(params.get("city") ?? "");
    setPriceMin(params.get("priceMin") ?? "");
    setPriceMax(params.get("priceMax") ?? "");
    setRooms(params.get("rooms") ?? "");
  }, [params]);

  function apply() {
    const p = new URLSearchParams();
    if (listingType) p.set("listingType", listingType);
    if (type) p.set("type", type);
    if (city) p.set("city", city);
    if (priceMin) p.set("priceMin", priceMin);
    if (priceMax) p.set("priceMax", priceMax);
    if (rooms) p.set("rooms", rooms);
    router.push(`/properties?${p.toString()}`);
  }

  function reset() {
    setListingType(""); setType(""); setCity(""); setPriceMin(""); setPriceMax(""); setRooms("");
    router.push("/properties");
  }

  return (
    <aside className="card p-5 space-y-5 h-fit sticky top-20">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" /> {t.title}
        </h3>
        <button onClick={reset} className="text-xs text-ink-500 hover:text-brand-600 flex items-center gap-1">
          <X className="h-3 w-3" /> {t.clear}
        </button>
      </div>

      <div className="flex gap-1 p-1 rounded-lg bg-ink-100 dark:bg-ink-800">
        {[["", t.all], ["SALE", t.buy], ["RENT", t.rent]].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setListingType(v)}
            className={`flex-1 px-3 py-2 text-xs font-semibold rounded-md transition ${
              listingType === v ? "bg-white dark:bg-ink-950 shadow" : ""
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.type}</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="input">
          <option value="">{t.any}</option>
          <option value="APARTMENT">Apartment</option>
          <option value="VILLA">Villa</option>
          <option value="DUPLEX">Duplex</option>
          <option value="OFFICE">Office</option>
          <option value="SHOP">Shop</option>
          <option value="LAND">Land</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.city}</label>
        <select value={city} onChange={(e) => setCity(e.target.value)} className="input">
          <option value="">{t.allCities}</option>
          <option>Tirana</option>
          <option>Durrës</option>
          <option>Vlorë</option>
          <option>Sarandë</option>
          <option>Shkodër</option>
          <option>Pogradec</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.priceRange}</label>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" placeholder={t.min} value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="input" />
          <input type="number" placeholder={t.max} value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="input" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.rooms}</label>
        <div className="grid grid-cols-5 gap-1">
          {["", "1", "2", "3", "4+"].map((r) => (
            <button
              key={r || "any"}
              onClick={() => setRooms(r)}
              className={`py-2 text-xs font-semibold rounded-md border transition ${
                rooms === r ? "bg-brand-600 text-white border-brand-600" : "hover:bg-ink-100 dark:hover:bg-ink-800"
              }`}
            >
              {r || t.any}
            </button>
          ))}
        </div>
      </div>

      <button onClick={apply} className="btn-primary w-full">{t.apply}</button>
    </aside>
  );
}
