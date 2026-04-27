import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const [properties, agents, offices, cityCounts] = await Promise.all([
    prisma.property.count({ where: { status: "ACTIVE" } }),
    prisma.agent.count(),
    prisma.office.count(),
    prisma.property.groupBy({ by: ["city"], _count: { _all: true } }),
  ]);
  return NextResponse.json({ properties, agents, offices, cityCounts });
}
