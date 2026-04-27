"use client";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Maximize, MapPin, Heart } from "lucide-react";
import { formatPrice, formatArea } from "@/lib/utils";

type CardDict = { featured: string; forSale: string; forRent: string };
type Props = {
  property: {
    slug: string;
    title: string;
    price: any;
    currency: string;
    listingType: string;
    type: string;
    city: string;
    neighborhood: string;
    areaM2: number;
    rooms: number | null;
    bathrooms: number | null;
    featured: boolean;
    images: { url: string }[];
  };
  dict?: CardDict;
};

export function PropertyCard({ property, dict }: Props) {
  const t = dict ?? { featured: "Featured", forSale: "For Sale", forRent: "For Rent" };
  const cover = property.images[0]?.url ?? "https://picsum.photos/800/600";
  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group card overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-100 dark:bg-ink-800">
        <Image
          src={cover}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized={cover.startsWith("/uploads/")}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {property.featured && (
            <span className="chip bg-gradient-to-r from-gold-500 to-accent-500 text-white shadow">★ {t.featured}</span>
          )}
          <span className="chip bg-white/90 text-ink-900">
            {property.listingType === "RENT" ? t.forRent : t.forSale}
          </span>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); }}
          className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink-900 opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-600 hover:text-white"
          aria-label="Save"
        >
          <Heart className="h-4 w-4" />
        </button>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span className="chip bg-ink-950/80 text-white backdrop-blur">
            {property.type}
          </span>
          <span className="rounded-lg bg-white/95 dark:bg-ink-900/95 px-3 py-1.5 text-sm font-bold shadow">
            {formatPrice(property.price, property.currency, property.listingType)}
          </span>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-brand-600 transition-colors">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-sm text-ink-500">
          <MapPin className="h-3.5 w-3.5" />
          {property.neighborhood}, {property.city}
        </div>
        <div className="flex items-center gap-4 pt-3 border-t text-sm text-ink-600 dark:text-ink-400">
          {property.rooms !== null && (
            <span className="flex items-center gap-1.5">
              <Bed className="h-4 w-4" /> {property.rooms}
            </span>
          )}
          {property.bathrooms !== null && (
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4" /> {property.bathrooms}
            </span>
          )}
          <span className="flex items-center gap-1.5 ml-auto">
            <Maximize className="h-4 w-4" /> {formatArea(property.areaM2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
