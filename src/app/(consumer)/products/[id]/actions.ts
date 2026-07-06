"use server";

import { prisma } from "@/lib/prisma";
import { purchaseRequestSchema } from "@/lib/validation";

export type PurchaseRequestActionState = {
  status: "idle" | "error" | "success";
  errors?: Record<string, string[] | undefined>;
  requestId?: string;
};

export async function createPurchaseRequest(
  _prevState: PurchaseRequestActionState,
  formData: FormData
): Promise<PurchaseRequestActionState> {
  const parsed = purchaseRequestSchema.safeParse({
    productId: formData.get("productId"),
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    customerEmail: formData.get("customerEmail"),
    quantity: formData.get("quantity"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { status: "error", errors: parsed.error.flatten().fieldErrors };
  }

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product) {
    return { status: "error", errors: { productId: ["상품을 찾을 수 없습니다."] } };
  }

  const request = await prisma.purchaseRequest.create({
    data: {
      productId: product.id,
      farmId: product.farmId,
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      customerEmail: parsed.data.customerEmail || null,
      quantity: parsed.data.quantity,
      message: parsed.data.message || null,
    },
  });

  return { status: "success", requestId: request.id };
}
