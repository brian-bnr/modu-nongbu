"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type DroneOperatorActionState = {
  status: "idle" | "error" | "success";
  error?: string;
};

export async function applyAsDroneOperator(
  _prevState: DroneOperatorActionState,
  formData: FormData
): Promise<DroneOperatorActionState> {
  const session = await auth();
  if (session?.user?.type !== "user") {
    return { status: "error", error: "로그인이 필요합니다." };
  }

  const existing = await prisma.droneOperator.findUnique({
    where: { userId: session.user.id },
  });
  if (existing) {
    return { status: "error", error: "이미 방제사 신청 내역이 있습니다." };
  }

  const equipmentInfo = String(formData.get("equipmentInfo") ?? "").trim();
  const experienceYearsRaw = String(formData.get("experienceYears") ?? "").trim();
  const experienceYears = experienceYearsRaw ? Number(experienceYearsRaw) : null;

  await prisma.droneOperator.create({
    data: {
      userId: session.user.id,
      equipmentInfo: equipmentInfo || null,
      experienceYears:
        experienceYears != null && Number.isInteger(experienceYears) && experienceYears >= 0
          ? experienceYears
          : null,
    },
  });

  revalidatePath("/drones/operator");
  return { status: "success" };
}
