import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const visitorId = body?.visitorId;
  const visitDate = body?.visitDate;

  if (typeof visitorId !== "string" || typeof visitDate !== "string") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  await prisma.visit.upsert({
    where: { visitorId_visitDate: { visitorId, visitDate } },
    update: {},
    create: { visitorId, visitDate },
  });

  return NextResponse.json({ ok: true });
}
