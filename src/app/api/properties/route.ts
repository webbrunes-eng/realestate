import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const where: Prisma.PropertyWhereInput = { status: "ACTIVE" };

  const listingType = searchParams.get("listingType");
  if (listingType === "SALE" || listingType === "RENT") where.listingType = listingType;

  const type = searchParams.get("type");
  if (type) where.type = type as any;

  const city = searchParams.get("city");
  if (city) where.city = city;

  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  if (priceMin || priceMax) {
    where.price = {};
    if (priceMin) (where.price as any).gte = parseFloat(priceMin);
    if (priceMax) (where.price as any).lte = parseFloat(priceMax);
  }

  const rooms = searchParams.get("rooms");
  if (rooms) where.rooms = rooms === "4+" ? { gte: 4 } : parseInt(rooms);

  const take = Math.min(parseInt(searchParams.get("take") ?? "24"), 60);
  const skip = parseInt(searchParams.get("skip") ?? "0");

  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: { images: { take: 1, orderBy: { orderIndex: "asc" } } },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    }),
    prisma.property.count({ where }),
  ]);

  return NextResponse.json({ items, total });
}
