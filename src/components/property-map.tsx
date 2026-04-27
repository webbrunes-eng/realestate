"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

const icon = new L.DivIcon({
  html: `<div style="background:#ea580c;color:white;font-weight:700;padding:6px 10px;border-radius:999px;white-space:nowrap;box-shadow:0 4px 10px rgba(234,88,12,.4);border:2px solid white;font-size:12px">●</div>`,
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

type Prop = {
  properties: {
    id: string;
    slug: string;
    title: string;
    price: any;
    currency: string;
    listingType: string;
    lat: number;
    lng: number;
  }[];
  center?: [number, number];
  zoom?: number;
  height?: string;
};

export default function PropertyMap({ properties, center = [41.3275, 19.8187], zoom = 8, height = "600px" }: Prop) {
  const mapKey = `${center[0]}-${center[1]}-${zoom}-${properties.length}`;
  return (
    <div style={{ height }} className="rounded-2xl overflow-hidden border">
      <MapContainer key={mapKey} center={center} zoom={zoom} scrollWheelZoom>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {properties.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={icon}>
            <Popup>
              <Link href={`/properties/${p.slug}`} className="block space-y-1">
                <div className="font-semibold">{p.title}</div>
                <div className="text-brand-600 font-bold">
                  {formatPrice(p.price, p.currency, p.listingType)}
                </div>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
