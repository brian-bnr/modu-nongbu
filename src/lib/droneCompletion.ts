import { prisma } from "@/lib/prisma";
import { createSettlement } from "@/lib/settlementCore";

export async function finalizeCompletion(reservationId: string) {
  const reservation = await prisma.droneReservation.findUnique({
    where: { id: reservationId },
  });
  if (!reservation || reservation.status !== "COMPLETION_REQUESTED") {
    return;
  }

  await prisma.droneReservation.update({
    where: { id: reservationId },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  await createSettlement(reservationId);
}
