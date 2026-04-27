"use client";
import { useState, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, Plus, Trash2, Upload, Link2, Loader2 } from "lucide-react";

type Agent = { id: string; user: { name: string } };
type Property = {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  type?: string;
  listingType?: string;
  status?: string;
  price?: number;
  currency?: string;
  areaM2?: number;
  rooms?: number | null;
  bathrooms?: number | null;
  floor?: number | null;
  yearBuilt?: number | null;
  city?: string;
  neighborhood?: string;
  address?: string;
  lat?: number;
  lng?: number;
  featured?: boolean;
  agentId?: string;
  images?: { url: string }[];
};

type Dict = {
  back: string;
  cancel: string;
  save: string;
  saving: string;
  update: string;
  create: string;
  basicInfo: string;
  title: string;
  description: string;
  type: string;
  listing: string;
  status: string;
  pricing: string;
  price: string;
  area: string;
  rooms: string;
  bathrooms: string;
  floor: string;
  year: string;
  location: string;
  city: string;
  neighborhood: string;
  address: string;
  latitude: string;
  longitude: string;
  images: string;
  imagesHint: string;
  addUrl: string;
  uploadFiles: string;
  uploading: string;
  paste: string;
  upload: string;
  assignment: string;
  agent: string;
  feature: string;
};

export function PropertyForm({
  property,
  agents,
  dict,
}: {
  property?: Property;
  agents: Agent[];
  dict?: Partial<Dict>;
}) {
  const t: Dict = {
    back: dict?.back ?? "Back",
    cancel: dict?.cancel ?? "Cancel",
    save: dict?.save ?? "Save",
    saving: dict?.saving ?? "Saving...",
    update: dict?.update ?? "Update property",
    create: dict?.create ?? "Create property",
    basicInfo: dict?.basicInfo ?? "Basic info",
    title: dict?.title ?? "Title",
    description: dict?.description ?? "Description",
    type: dict?.type ?? "Type",
    listing: dict?.listing ?? "Listing",
    status: dict?.status ?? "Status",
    pricing: dict?.pricing ?? "Pricing & size",
    price: dict?.price ?? "Price (EUR)",
    area: dict?.area ?? "Area m²",
    rooms: dict?.rooms ?? "Rooms",
    bathrooms: dict?.bathrooms ?? "Bathrooms",
    floor: dict?.floor ?? "Floor",
    year: dict?.year ?? "Year built",
    location: dict?.location ?? "Location",
    city: dict?.city ?? "City",
    neighborhood: dict?.neighborhood ?? "Neighborhood",
    address: dict?.address ?? "Address",
    latitude: dict?.latitude ?? "Latitude",
    longitude: dict?.longitude ?? "Longitude",
    images: dict?.images ?? "Images",
    imagesHint: dict?.imagesHint ?? "Upload from your computer or paste an image URL. The first image is the cover.",
    addUrl: dict?.addUrl ?? "Add URL",
    uploadFiles: dict?.uploadFiles ?? "Upload from computer",
    uploading: dict?.uploading ?? "Uploading...",
    paste: dict?.paste ?? "Paste image URL",
    upload: dict?.upload ?? "Upload",
    assignment: dict?.assignment ?? "Assignment",
    agent: dict?.agent ?? "Agent",
    feature: dict?.feature ?? "Feature on homepage",
  };

  const router = useRouter();
  const [f, setF] = useState<any>({
    title: property?.title ?? "",
    description: property?.description ?? "",
    type: property?.type ?? "APARTMENT",
    listingType: property?.listingType ?? "SALE",
    status: property?.status ?? "ACTIVE",
    price: property?.price ?? 100000,
    currency: property?.currency ?? "EUR",
    areaM2: property?.areaM2 ?? 80,
    rooms: property?.rooms ?? 2,
    bathrooms: property?.bathrooms ?? 1,
    floor: property?.floor ?? null,
    yearBuilt: property?.yearBuilt ?? 2020,
    city: property?.city ?? "Tirana",
    neighborhood: property?.neighborhood ?? "",
    address: property?.address ?? "",
    lat: property?.lat ?? 41.3275,
    lng: property?.lng ?? 19.8187,
    featured: property?.featured ?? false,
    agentId: property?.agentId ?? agents[0]?.id,
  });
  const [images, setImages] = useState<string[]>(property?.images?.map((i) => i.url) ?? []);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function set(k: string, v: any) {
    setF({ ...f, [k]: v });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const payload = { ...f, images: images.filter((u) => u.trim()) };
    const url = property?.id ? `/api/admin/properties/${property.id}` : "/api/admin/properties";
    const method = property?.id ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/properties");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setErr(d.error ?? "Save failed");
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    setUploading(true);
    setErr("");
    try {
      const form = new FormData();
      Array.from(files).forEach((file) => form.append("files", file));
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setImages((prev) => [...prev, ...data.urls]);
    } catch (e: any) {
      setErr(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const cities = ["Tirana", "Durrës", "Vlorë", "Sarandë", "Shkodër", "Pogradec"];

  return (
    <form onSubmit={submit} className="space-y-6 max-w-4xl">
      {err && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:border-red-900 dark:text-red-300">
          {err}
        </div>
      )}

      <div className="card p-6 space-y-4">
        <h2 className="font-semibold">{t.basicInfo}</h2>
        <div>
          <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.title}</label>
          <input required className="input mt-1" value={f.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.description}</label>
          <textarea required rows={4} className="input mt-1 resize-none" value={f.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.type}</label>
            <select className="input mt-1" value={f.type} onChange={(e) => set("type", e.target.value)}>
              {["APARTMENT", "VILLA", "DUPLEX", "OFFICE", "SHOP", "LAND"].map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.listing}</label>
            <select className="input mt-1" value={f.listingType} onChange={(e) => set("listingType", e.target.value)}>
              <option>SALE</option><option>RENT</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.status}</label>
            <select className="input mt-1" value={f.status} onChange={(e) => set("status", e.target.value)}>
              <option>ACTIVE</option><option>PENDING</option><option>SOLD</option><option>DRAFT</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="font-semibold">{t.pricing}</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.price}</label>
            <input type="number" required className="input mt-1" value={f.price} onChange={(e) => set("price", +e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.area}</label>
            <input type="number" required className="input mt-1" value={f.areaM2} onChange={(e) => set("areaM2", +e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.rooms}</label>
            <input type="number" className="input mt-1" value={f.rooms ?? ""} onChange={(e) => set("rooms", e.target.value ? +e.target.value : null)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.bathrooms}</label>
            <input type="number" className="input mt-1" value={f.bathrooms ?? ""} onChange={(e) => set("bathrooms", e.target.value ? +e.target.value : null)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.floor}</label>
            <input type="number" className="input mt-1" value={f.floor ?? ""} onChange={(e) => set("floor", e.target.value ? +e.target.value : null)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.year}</label>
            <input type="number" className="input mt-1" value={f.yearBuilt ?? ""} onChange={(e) => set("yearBuilt", e.target.value ? +e.target.value : null)} />
          </div>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="font-semibold">{t.location}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.city}</label>
            <select className="input mt-1" value={f.city} onChange={(e) => set("city", e.target.value)}>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.neighborhood}</label>
            <input required className="input mt-1" value={f.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.address}</label>
            <input required className="input mt-1" value={f.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.latitude}</label>
            <input type="number" step="any" required className="input mt-1" value={f.lat} onChange={(e) => set("lat", +e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.longitude}</label>
            <input type="number" step="any" required className="input mt-1" value={f.lng} onChange={(e) => set("lng", +e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="font-semibold">{t.images}</h2>
        <p className="text-xs text-ink-500">{t.imagesHint}</p>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="btn-primary"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? t.uploading : t.uploadFiles}
          </button>
          <button type="button" onClick={() => setImages([...images, ""])} className="btn-secondary">
            <Link2 className="h-4 w-4" /> {t.addUrl}
          </button>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((url, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-900 aspect-[4/3]">
                {url ? (
                  /^https?:/.test(url) || url.startsWith("/") ? (
                    <Image src={url} alt="" fill sizes="200px" className="object-cover" unoptimized={url.startsWith("/uploads/")} />
                  ) : null
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-xs text-ink-400">empty</div>
                )}
                {i === 0 && url && (
                  <span className="absolute left-2 top-2 z-10 bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, j) => j !== i))}
                  className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition"
                  aria-label="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {images.map((url, i) =>
          url && (/^https?:/.test(url) || url.startsWith("/")) ? null : (
            <div key={`url-${i}`} className="flex gap-2">
              <input
                className="input"
                placeholder={t.paste}
                value={url}
                onChange={(e) => setImages(images.map((u, j) => (j === i ? e.target.value : u)))}
              />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, j) => j !== i))}
                className="btn-ghost !p-2 text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )
        )}
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="font-semibold">{t.assignment}</h2>
        <div>
          <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{t.agent}</label>
          <select className="input mt-1" value={f.agentId} onChange={(e) => set("agentId", e.target.value)}>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>{a.user.name}</option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-brand-600" />
          <span className="text-sm font-medium">{t.feature}</span>
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => router.back()} className="btn-secondary">{t.cancel}</button>
        <button disabled={loading} className="btn-primary">
          <Save className="h-4 w-4" />
          {loading ? t.saving : property?.id ? t.update : t.create}
        </button>
      </div>
    </form>
  );
}
