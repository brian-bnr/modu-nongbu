"use server";

import { revalidatePath } from "next/cache";
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
