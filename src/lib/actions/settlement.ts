"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function markSettlementPaid(settlementId: string) {
  const session = await auth();
  if (session?.user?.type !== "admin") {
    throw new Error("관리자만 처리할 수 있습니다.");
  }

  const settlement = await prisma.settlement.findUnique({ where: { id: settlementId } });
  if (!settlement || settlement.status !== "PENDING") {
    throw new Error("이미 처리되었거나 대기 상태가 아닌 정산입니다.");
  }

  await prisma.settlement.update({
    where: { id: settlementId },
    data: { status: "PAID", paidAt: new Date() },
  });

  revalidatePath("/admin/settlements");
}
