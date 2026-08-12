import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 같은 IP에서 짧은 시간 내 반복 요청이 오면(쿠키 없이 매번 새 visitorId를 만드는
// 봇/스캐너 등) 새 방문 기록을 남기지 않는다. 단일 Node 프로세스로 떠 있는
// 서버라 인메모리 Map으로 충분하다.
const RATE_LIMIT_WINDOW_MS = 10_000;
const lastWriteByIp = new Map<string, number>();

function pruneStaleEntries(now: number) {
  for (const [ip, ts] of lastWriteByIp) {
    if (now - ts > RATE_LIMIT_WINDOW_MS) lastWriteByIp.delete(ip);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const visitorId = body?.visitorId;
  const visitDate = body?.visitDate;
  const clientIp = typeof body?.clientIp === "string" ? body.clientIp : "unknown";

  if (typeof visitorId !== "string" || typeof visitDate !== "string") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const now = Date.now();
  const lastWrite = lastWriteByIp.get(clientIp);
  if (lastWrite && now - lastWrite < RATE_LIMIT_WINDOW_MS) {
    return NextResponse.json({ ok: true, skipped: "rate-limited" });
  }

  lastWriteByIp.set(clientIp, now);
  if (lastWriteByIp.size > 5000) pruneStaleEntries(now);

  await prisma.visit.upsert({
    where: { visitorId_visitDate: { visitorId, visitDate } },
    update: {},
    create: { visitorId, visitDate },
  });

  return NextResponse.json({ ok: true });
}
