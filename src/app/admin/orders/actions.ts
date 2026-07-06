"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { orderStatusUpdateSchema } from "@/lib/validation";

export type OrderStatusActionState = {
  errors?: Record<string, string[] | undefined>;
  success?: boolean;
};

export async function updateOrderStatus(
  _prevState: OrderStatusActionState,
  formData: FormData
): Promise<OrderStatusActionState> {
  const parsed = orderStatusUpdateSchema.safeParse({
    requestId: formData.get("requestId"),
    status: formData.get("status"),
    adminNote: formData.get("adminNote"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.purchaseRequest.update({
    where: { id: parsed.data.requestId },
    data: {
      status: parsed.data.status,
      adminNote: parsed.data.adminNote || null,
    },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${parsed.data.requestId}`);
  revalidatePath("/orders/lookup");

  return { success: true };
}
