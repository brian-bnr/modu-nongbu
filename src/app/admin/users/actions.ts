"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type AdminUserActionState = {
  success?: boolean;
  error?: string;
};

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.type !== "admin") {
    throw new Error("관리자만 처리할 수 있습니다.");
  }
}

// 관리자가 회원을 방제사로 전환하고 즉시 승인 처리한다.
// 전화상담/오프라인으로 등록하는 방제사, 테스트 계정 준비 등
// 자체 신청(applyAsDroneOperator) 없이도 배정 가능한 상태로 만들 때 쓴다.
// 이미 방제사 신청이 PENDING/REJECTED/SUSPENDED 상태인 경우의 승인 처리도 겸한다.
export async function adminApproveAsOperator(
  _prevState: AdminUserActionState,
  formData: FormData
): Promise<AdminUserActionState> {
  await requireAdmin();

  const userId = String(formData.get("userId") ?? "");
  if (!userId) {
    return { error: "잘못된 요청입니다." };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { error: "회원을 찾을 수 없습니다." };
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { role: "OPERATOR" } }),
    prisma.droneOperator.upsert({
      where: { userId },
      update: { status: "APPROVED" },
      create: { userId, status: "APPROVED" },
    }),
  ]);

  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/admin/users");
  revalidatePath("/admin/drones");
  return { success: true };
}
