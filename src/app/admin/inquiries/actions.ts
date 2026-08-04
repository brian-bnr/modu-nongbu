"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { inquiryStatusUpdateSchema } from "@/lib/validation";

export type InquiryStatusActionState = {
  success?: boolean;
  error?: string;
};

export async function updateInquiryStatus(
  _prevState: InquiryStatusActionState,
  formData: FormData
): Promise<InquiryStatusActionState> {
  const parsed = inquiryStatusUpdateSchema.safeParse({
    inquiryId: formData.get("inquiryId"),
    status: formData.get("status"),
    adminNote: formData.get("adminNote"),
  });

  if (!parsed.success) {
    return { error: "입력값을 확인해주세요." };
  }

  await prisma.inquiry.update({
    where: { id: parsed.data.inquiryId },
    data: { status: parsed.data.status, adminNote: parsed.data.adminNote || null },
  });

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${parsed.data.inquiryId}`);
  revalidatePath("/my/inquiries");

  return { success: true };
}
