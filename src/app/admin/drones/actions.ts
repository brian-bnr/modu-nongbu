"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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
