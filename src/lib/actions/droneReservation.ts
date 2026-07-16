"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { droneReservationSchema } from "@/lib/validation";
import { finalizeCompletion } from "@/lib/droneCompletion";
import { getCropUnitPrice } from "@/lib/cropPricing";

export type DroneReservationActionState = {
  status: "idle" | "error" | "success";
  errors?: Record<string, string[] | undefined>;
  reservationId?: string;
};

async function getPlatformSetting() {
  return prisma.platformSetting.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
}

export async function createDroneReservation(
  _prevState: DroneReservationActionState,
  formData: FormData
): Promise<DroneReservationActionState> {
  const session = await auth();
  if (session?.user?.type !== "user") {
    return { status: "error", errors: { region: ["로그인이 필요합니다."] } };
  }

  const parsed = droneReservationSchema.safeParse({
    region: formData.get("region"),
    regionDetail: formData.get("regionDetail"),
    areaPyeong: formData.get("areaPyeong"),
    cropType: formData.get("cropType"),
    desiredDate: formData.get("desiredDate"),
    parcelPnu: formData.get("parcelPnu"),
    parcelJibun: formData.get("parcelJibun"),
    parcelAreaSqm: formData.get("parcelAreaSqm"),
  });

  if (!parsed.success) {
    return { status: "error", errors: parsed.error.flatten().fieldErrors };
  }

  const unitPrice = getCropUnitPrice(parsed.data.cropType);
  const totalPrice = parsed.data.areaPyeong * unitPrice;

  const reservation = await prisma.droneReservation.create({
    data: {
      farmerId: session.user.id,
      region: parsed.data.region,
      regionDetail: parsed.data.regionDetail || null,
      areaPyeong: parsed.data.areaPyeong,
      cropType: parsed.data.cropType,
      desiredDate: new Date(parsed.data.desiredDate),
      unitPrice,
      totalPrice,
      parcelPnu: parsed.data.parcelPnu || null,
      parcelJibun: parsed.data.parcelJibun || null,
      parcelAreaSqm: parsed.data.parcelAreaSqm ?? null,
    },
  });

  revalidatePath("/drones");
  redirect(`/drones/${reservation.id}`);
}

export async function mockPayReservation(reservationId: string) {
  const session = await auth();
  if (session?.user?.type !== "user") {
    throw new Error("로그인이 필요합니다.");
  }

  const reservation = await prisma.droneReservation.findUnique({
    where: { id: reservationId },
  });
  if (!reservation || reservation.farmerId !== session.user.id) {
    throw new Error("예약을 찾을 수 없습니다.");
  }
  if (reservation.status !== "REQUESTED") {
    throw new Error("이미 결제가 진행된 예약입니다.");
  }

  await prisma.$transaction([
    prisma.payment.create({
      data: {
        reservationId: reservation.id,
        amount: reservation.totalPrice,
        method: "mock",
        status: "HELD",
        isMock: true,
      },
    }),
    prisma.droneReservation.update({
      where: { id: reservation.id },
      data: { status: "PAID" },
    }),
  ]);

  revalidatePath(`/drones/${reservation.id}`);
  revalidatePath("/drones");
}

export async function cancelReservation(reservationId: string) {
  const session = await auth();
  if (session?.user?.type !== "user") {
    throw new Error("로그인이 필요합니다.");
  }

  const reservation = await prisma.droneReservation.findUnique({
    where: { id: reservationId },
    include: { payment: true },
  });
  if (!reservation || reservation.farmerId !== session.user.id) {
    throw new Error("예약을 찾을 수 없습니다.");
  }

  if (reservation.status === "REQUESTED") {
    await prisma.droneReservation.update({
      where: { id: reservation.id },
      data: { status: "CANCELLED", cancelledAt: new Date(), cancelReason: "결제 전 취소" },
    });
  } else if (reservation.status === "PAID") {
    const setting = await getPlatformSetting();
    void setting; // 배정 전 취소 = 전액 환불이므로 취소수수료율은 사용하지 않음
    await prisma.$transaction([
      prisma.payment.update({
        where: { reservationId: reservation.id },
        data: { status: "REFUNDED", refundAmount: reservation.payment?.amount ?? reservation.totalPrice },
      }),
      prisma.droneReservation.update({
        where: { id: reservation.id },
        data: { status: "CANCELLED", cancelledAt: new Date(), cancelReason: "배정 전 취소(전액 환불)" },
      }),
    ]);
  } else if (reservation.status === "ASSIGNED") {
    const setting = await getPlatformSetting();
    const amount = reservation.payment?.amount ?? reservation.totalPrice;
    const cancelFee = Math.round((amount * setting.droneCancelFeeRate) / 100);
    const refundAmount = amount - cancelFee;
    await prisma.$transaction([
      prisma.payment.update({
        where: { reservationId: reservation.id },
        data: { status: "PARTIALLY_REFUNDED", refundAmount },
      }),
      prisma.droneReservation.update({
        where: { id: reservation.id },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
          cancelReason: `배정 후 취소(취소수수료 ${setting.droneCancelFeeRate}% 적용)`,
        },
      }),
    ]);
  } else {
    throw new Error("작업이 시작된 이후에는 취소할 수 없습니다. 이의제기를 이용해주세요.");
  }

  revalidatePath(`/drones/${reservation.id}`);
  revalidatePath("/drones");
}

export async function assignOperator(reservationId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("로그인이 필요합니다.");
  }

  const operator = await prisma.droneOperator.findUnique({
    where: { userId: session.user.id },
  });
  if (!operator || operator.status !== "APPROVED") {
    throw new Error("승인된 방제사만 작업을 수락할 수 있습니다.");
  }

  const reservation = await prisma.droneReservation.findUnique({
    where: { id: reservationId },
  });
  if (!reservation || reservation.status !== "PAID") {
    throw new Error("이미 배정되었거나 수락할 수 없는 예약입니다.");
  }

  await prisma.droneReservation.update({
    where: { id: reservationId },
    data: { operatorId: operator.id, status: "ASSIGNED" },
  });

  revalidatePath("/drones/operator");
}

async function getOwnOperatorReservation(reservationId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("로그인이 필요합니다.");
  }

  const operator = await prisma.droneOperator.findUnique({
    where: { userId: session.user.id },
  });
  const reservation = await prisma.droneReservation.findUnique({
    where: { id: reservationId },
  });
  if (!reservation || !operator || reservation.operatorId !== operator.id) {
    throw new Error("이 예약에 대한 권한이 없습니다.");
  }
  return reservation;
}

export async function startWork(reservationId: string, lat: number, lng: number) {
  const reservation = await getOwnOperatorReservation(reservationId);
  if (reservation.status !== "ASSIGNED") {
    throw new Error("이미 시작되었거나 시작할 수 없는 상태입니다.");
  }

  await prisma.droneReservation.update({
    where: { id: reservationId },
    data: { status: "IN_PROGRESS", startedAt: new Date(), startLat: lat, startLng: lng },
  });

  revalidatePath(`/drones/operator/${reservationId}`);
}

export async function endWork(
  reservationId: string,
  lat: number,
  lng: number,
  actualAreaPyeong: number
) {
  const reservation = await getOwnOperatorReservation(reservationId);
  if (reservation.status !== "IN_PROGRESS") {
    throw new Error("작업 중 상태가 아닙니다.");
  }

  const now = new Date();
  const adjustmentAmount = (actualAreaPyeong - reservation.areaPyeong) * reservation.unitPrice;

  await prisma.$transaction([
    prisma.droneReservation.update({
      where: { id: reservationId },
      data: {
        status: "COMPLETION_REQUESTED",
        endedAt: now,
        endLat: lat,
        endLng: lng,
        completionRequestedAt: now,
        actualAreaPyeong,
      },
    }),
    prisma.payment.update({
      where: { reservationId },
      data: { additionalAmount: adjustmentAmount },
    }),
  ]);

  revalidatePath(`/drones/operator/${reservationId}`);
  revalidatePath(`/drones/${reservationId}`);
}

export async function payAdditionalAmount(reservationId: string) {
  const session = await auth();
  if (session?.user?.type !== "user") {
    throw new Error("로그인이 필요합니다.");
  }

  const reservation = await prisma.droneReservation.findUnique({
    where: { id: reservationId },
    include: { payment: true },
  });
  if (!reservation || reservation.farmerId !== session.user.id) {
    throw new Error("이 예약에 대한 권한이 없습니다.");
  }
  if (!reservation.payment || reservation.payment.additionalAmount <= 0) {
    throw new Error("추가 결제할 금액이 없습니다.");
  }
  if (reservation.payment.additionalPaid) {
    throw new Error("이미 결제되었습니다.");
  }

  await prisma.payment.update({
    where: { reservationId },
    data: { additionalPaid: true },
  });

  revalidatePath(`/drones/${reservationId}`);
}

export async function uploadWorkPhoto(
  reservationId: string,
  url: string,
  lat?: number,
  lng?: number
) {
  await getOwnOperatorReservation(reservationId);

  await prisma.droneWorkPhoto.create({
    data: { reservationId, url, lat: lat ?? null, lng: lng ?? null },
  });

  revalidatePath(`/drones/operator/${reservationId}`);
  revalidatePath(`/drones/${reservationId}`);
}

export async function approveCompletion(reservationId: string) {
  const session = await auth();
  if (session?.user?.type !== "user") {
    throw new Error("로그인이 필요합니다.");
  }

  const reservation = await prisma.droneReservation.findUnique({
    where: { id: reservationId },
    include: { payment: true },
  });
  if (!reservation || reservation.farmerId !== session.user.id) {
    throw new Error("이 예약에 대한 권한이 없습니다.");
  }
  if (reservation.status !== "COMPLETION_REQUESTED") {
    throw new Error("완료 대기 상태가 아닙니다.");
  }
  if (
    reservation.payment &&
    reservation.payment.additionalAmount > 0 &&
    !reservation.payment.additionalPaid
  ) {
    throw new Error("면적 초과분에 대한 추가 결제를 먼저 진행해주세요.");
  }

  await finalizeCompletion(reservationId);

  revalidatePath(`/drones/${reservationId}`);
}

export async function raiseDispute(reservationId: string, reason: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("로그인이 필요합니다.");
  }

  const reservation = await prisma.droneReservation.findUnique({
    where: { id: reservationId },
    include: { operator: true },
  });
  if (!reservation) {
    throw new Error("예약을 찾을 수 없습니다.");
  }
  const isFarmer = reservation.farmerId === session.user.id;
  const isOperator = reservation.operator?.userId === session.user.id;
  if (!isFarmer && !isOperator) {
    throw new Error("이 예약에 대한 권한이 없습니다.");
  }

  await prisma.$transaction([
    prisma.dispute.create({
      data: {
        reservationId: reservation.id,
        raisedById: session.user.id,
        reason,
      },
    }),
    prisma.droneReservation.update({
      where: { id: reservation.id },
      data: { status: "DISPUTED" },
    }),
  ]);

  revalidatePath(`/drones/${reservation.id}`);
}
