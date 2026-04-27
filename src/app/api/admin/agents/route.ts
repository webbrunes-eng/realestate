import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, hashPassword } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
  title: z.string(),
  bio: z.string().optional(),
  photo: z.string().optional(),
  languages: z.array(z.string()),
  rating: z.number().min(0).max(5),
  soldCount: z.number().int().min(0),
  featured: z.boolean(),
  officeId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const body = schema.parse(await req.json());
    const exists = await prisma.user.findUnique({ where: { email: body.email } });
    if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 400 });

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        phone: body.phone || null,
        passwordHash: await hashPassword(body.password),
        role: "AGENT",
      },
    });
    const agent = await prisma.agent.create({
      data: {
        userId: user.id,
        officeId: body.officeId || null,
        title: body.title,
        bio: body.bio || null,
        photo: body.photo || null,
        languages: body.languages,
        rating: body.rating,
        soldCount: body.soldCount,
        featured: body.featured,
      },
    });
    return NextResponse.json({ ok: true, id: agent.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Bad request" }, { status: 400 });
  }
}
