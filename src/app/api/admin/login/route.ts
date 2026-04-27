import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { login, createSession } from "@/lib/auth";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: NextRequest) {
  try {
    const { email, password } = schema.parse(await req.json());
    const session = await login(email, password);
    if (!session) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    if (session.role !== "ADMIN") return NextResponse.json({ error: "Admin access only" }, { status: 403 });
    await createSession(session);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
