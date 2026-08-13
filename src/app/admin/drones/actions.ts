"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { finalizeCompletion } from "@/lib/droneCompletion";
import { createSettlement } from "@/lib/settlementCore";

export type AdminActionState = {
  success?: boolean;
  error?: string;
};

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.type !== "admin") {
    throw new Error("관리자만 처리할 수 있습니다.");
  }
}

export async function adminAssignOperator(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await requireAdmin();

  const reservationId = String(formData.get("reservationId") ?? "");
  const operatorId = String(formData.get("operatorId") ?? "");

  if (!reservationId || !operatorId) {
    return { error: "방제사를 선택해주세요." };
  }

  const reservation = await prisma.droneReservation.findUnique({ where: { id: reservationId } });
  if (!reservation || reservation.status !== "PAID") {
    return { error: "결제완료 상태의 예약만 방제사를 배정할 수 있습니다." };
  }

  const operator = await prisma.droneOperator.findUnique({ where: { id: operatorId } });
  if (!operator || operator.status !== "APPROVED") {
    return { error: "승인된 방제사만 배정할 수 있습니다." };
  }

  await prisma.droneReservation.update({
    where: { id: reservationId },
    data: { operatorId, status: "ASSIGNED" },
  });

  revalidatePath(`/admin/drones/${reservationId}`);
  revalidatePath("/admin/drones");
  return { success: true };
}

// 관리자가 현장에서 작업 완료를 전화·문자 등으로 전해듣고 직접 완료 처리하는 경로.
// 방제사 자신의 GPS 시작/종료 기록이 없는 경우, 신청 면적 그대로 완료 처리한다.
export async function adminMarkCompleted(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await requireAdmin();

  const reservationId = String(formData.get("reservationId") ?? "");
  if (!reservationId) {
    return { error: "잘못된 요청입니다." };
  }

  const reservation = await prisma.droneReservation.findUnique({
    where: { id: reservationId },
    include: { payment: true },
  });
  if (!reservation) {
    return { error: "예약을 찾을 수 없습니다." };
  }
  if (!reservation.operatorId) {
    return { error: "방제사가 배정되지 않았습니다." };
  }
  if (!["ASSIGNED", "IN_PROGRESS", "COMPLETION_REQUESTED"].includes(reservation.status)) {
    return { error: "지금 상태에서는 완료 처리할 수 없습니다." };
  }
  if (
    reservation.payment &&
    reservation.payment.additionalAmount > 0 &&
    !reservation.payment.additionalPaid
  ) {
    return { error: "면적 초과분 추가 결제가 완료되지 않아 완료 처리할 수 없습니다." };
  }

  if (reservation.status === "COMPLETION_REQUESTED") {
    // 이미 완료대기 상태라면 기존 로직(정산 생성 포함)을 그대로 재사용한다.
    await finalizeCompletion(reservationId);
  } else {
    await prisma.droneReservation.update({
      where: { id: reservationId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        actualAreaPyeong: reservation.actualAreaPyeong ?? reservation.areaPyeong,
      },
    });
    await createSettlement(reservationId);
  }

  revalidatePath(`/admin/drones/${reservationId}`);
  revalidatePath("/admin/drones");
  revalidatePath("/admin/settlements");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateDroneAdminNote(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await requireAdmin();

  const reservationId = String(formData.get("reservationId") ?? "");
  const adminNote = String(formData.get("adminNote") ?? "");

  if (!reservationId) {
    return { error: "잘못된 요청입니다." };
  }

  await prisma.droneReservation.update({
    where: { id: reservationId },
    data: { adminNote: adminNote || null },
  });

  revalidatePath(`/admin/drones/${reservationId}`);
  return { success: true };
}

export async function resolveDispute(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await requireAdmin();

  const disputeId = String(formData.get("disputeId") ?? "");
  const resolution = String(formData.get("resolution") ?? "");
  const reservationId = String(formData.get("reservationId") ?? "");

  if (!disputeId || !reservationId) {
    return { error: "잘못된 요청입니다." };
  }

  await prisma.dispute.update({
    where: { id: disputeId },
    data: { status: "RESOLVED", resolution: resolution || null },
  });

  revalidatePath(`/admin/drones/${reservationId}`);
  return { success: true };
}
