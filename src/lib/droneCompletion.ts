import { prisma } from "@/lib/prisma";
import { createSettlement } from "@/lib/settlementCore";

export async function finalizeCompletion(reservationId: string) {
  const reservation = await prisma.droneReservation.findUnique({
    where: { id: reservationId },
    include: { payment: true },
  });
  if (!reservation || reservation.status !== "COMPLETION_REQUESTED") {
    return;
  }
  if (reservation.payment && reservation.payment.additionalAmount > 0 && !reservation.payment.additionalPaid) {
    // 면적 초과분 추가 결제가 완료되지 않으면 자동승인(크론)도 보류
    return;
  }

  await prisma.droneReservation.update({
    where: { id: reservationId },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  await createSettlement(reservationId);
}
