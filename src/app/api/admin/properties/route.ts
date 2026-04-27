import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  type: z.enum(["APARTMENT", "VILLA", "DUPLEX", "OFFICE", "SHOP", "LAND"]),
  listingType: z.enum(["SALE", "RENT"]),
  status: z.enum(["ACTIVE", "SOLD", "DRAFT", "PENDING"]),
  price: z.number().positive(),
  currency: z.string().default("EUR"),
  areaM2: z.number().positive(),
  rooms: z.number().int().nullable(),
  bathrooms: z.number().int().nullable(),
  floor: z.number().int().nullable(),
  yearBuilt: z.number().int().nullable(),
  city: z.string().min(1),
  neighborhood: z.string().min(1),
  address: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  featured: z.boolean(),
  agentId: z.string(),
  images: z.array(z.string().refine((s) => s.startsWith("/") || /^https?:\/\//.test(s), "Invalid image path")).default([]),
});

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = schema.parse(await req.json());
    const baseSlug = slugify(body.title);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;
    const { images, ...data } = body;
    const property = await prisma.property.create({
      data: {
        ...data,
        slug,
        images: {
          create: images.map((url, i) => ({ url, orderIndex: i, isCover: i === 0 })),
        },
      },
    });
    return NextResponse.json({ ok: true, id: property.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Bad request" }, { status: 400 });
  }
}
