import { prisma } from "@/lib/prisma";

export async function createSettlement(reservationId: string) {
  const reservation = await prisma.droneReservation.findUnique({
    where: { id: reservationId },
    include: { payment: true },
  });

  if (!reservation || reservation.status !== "COMPLETED" || !reservation.operatorId) {
    return;
  }
  if (!reservation.payment || reservation.payment.status !== "HELD") {
    return;
  }

  const setting = await prisma.platformSetting.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  const grossAmount = reservation.payment.amount + reservation.payment.additionalAmount;
  const commissionRate = setting.droneCommissionRate;
  const commissionAmount = Math.round((grossAmount * commissionRate) / 100);
  const payoutAmount = grossAmount - commissionAmount;

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: reservation.payment.id },
      data: { status: "RELEASED" },
    }),
    prisma.settlement.create({
      data: {
        paymentId: reservation.payment.id,
        operatorId: reservation.operatorId,
        grossAmount,
        commissionRate,
        commissionAmount,
        payoutAmount,
        status: "PENDING",
      },
    }),
  ]);
}
