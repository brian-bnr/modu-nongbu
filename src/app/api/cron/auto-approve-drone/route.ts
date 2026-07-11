import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { finalizeCompletion } from "@/lib/droneCompletion";

const AUTO_APPROVE_HOURS = 36;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const threshold = new Date(Date.now() - AUTO_APPROVE_HOURS * 60 * 60 * 1000);

  const eligible = await prisma.droneReservation.findMany({
    where: {
      status: "COMPLETION_REQUESTED",
      completionRequestedAt: { lte: threshold },
    },
    select: { id: true },
  });

  for (const { id } of eligible) {
    await finalizeCompletion(id);
  }

  return NextResponse.json({ processed: eligible.length });
}
