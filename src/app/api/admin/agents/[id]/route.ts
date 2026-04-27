import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, hashPassword } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const { id } = await params;
  try {
    const body = await req.json();
    const agent = await prisma.agent.findUnique({ where: { id }, include: { user: true } });
    if (!agent) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.user.update({
      where: { id: agent.userId },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        ...(body.password ? { passwordHash: await hashPassword(body.password) } : {}),
      },
    });
    await prisma.agent.update({
      where: { id },
      data: {
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
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Bad request" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const { id } = await params;
  try {
    const agent = await prisma.agent.findUnique({ where: { id } });
    if (!agent) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await prisma.user.delete({ where: { id: agent.userId } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Cannot delete — has active listings" }, { status: 400 });
  }
}
