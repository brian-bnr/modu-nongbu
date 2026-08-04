"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type SettingsActionState = {
  success?: boolean;
  error?: string;
};

export async function updatePlatformSetting(
  _prevState: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  const session = await auth();
  if (session?.user?.type !== "admin") {
    return { error: "관리자만 처리할 수 있습니다." };
  }

  const droneUnitPrice = Number(formData.get("droneUnitPrice"));
  const droneCommissionRate = Number(formData.get("droneCommissionRate"));
  const droneCancelFeeRate = Number(formData.get("droneCancelFeeRate"));

  if (
    !Number.isFinite(droneUnitPrice) ||
    droneUnitPrice < 0 ||
    !Number.isFinite(droneCommissionRate) ||
    droneCommissionRate < 0 ||
    droneCommissionRate > 100 ||
    !Number.isFinite(droneCancelFeeRate) ||
    droneCancelFeeRate < 0 ||
    droneCancelFeeRate > 100
  ) {
    return { error: "입력값을 확인해주세요." };
  }

  await prisma.platformSetting.upsert({
    where: { id: "singleton" },
    update: { droneUnitPrice, droneCommissionRate, droneCancelFeeRate },
    create: { id: "singleton", droneUnitPrice, droneCommissionRate, droneCancelFeeRate },
  });

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function updateAdminAccount(
  _prevState: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  const session = await auth();
  if (session?.user?.type !== "admin") {
    return { error: "관리자만 처리할 수 있습니다." };
  }

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newEmail = String(formData.get("newEmail") ?? "").trim();
  const newPassword = String(formData.get("newPassword") ?? "");
  const newPasswordConfirm = String(formData.get("newPasswordConfirm") ?? "");

  if (!currentPassword) {
    return { error: "현재 비밀번호를 입력해주세요." };
  }

  const admin = await prisma.admin.findUnique({ where: { id: session.user.id } });
  if (!admin) {
    return { error: "관리자 계정을 찾을 수 없습니다." };
  }

  const passwordValid = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!passwordValid) {
    return { error: "현재 비밀번호가 일치하지 않습니다." };
  }

  if (!newEmail) {
    return { error: "이메일을 입력해주세요." };
  }

  if (newPassword || newPasswordConfirm) {
    if (newPassword.length < 8) {
      return { error: "새 비밀번호는 8자 이상이어야 합니다." };
    }
    if (newPassword !== newPasswordConfirm) {
      return { error: "새 비밀번호가 일치하지 않습니다." };
    }
  }

  if (newEmail !== admin.email) {
    const existing = await prisma.admin.findUnique({ where: { email: newEmail } });
    if (existing) {
      return { error: "이미 사용 중인 이메일입니다." };
    }
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      email: newEmail,
      ...(newPassword ? { passwordHash: await bcrypt.hash(newPassword, 10) } : {}),
    },
  });

  revalidatePath("/admin/settings");
  return { success: true };
}
