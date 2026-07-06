import { z } from "zod";

export const purchaseRequestSchema = z.object({
  productId: z.string().min(1),
  customerName: z.string().min(1, "이름을 입력해주세요."),
  customerPhone: z
    .string()
    .min(1, "연락처를 입력해주세요.")
    .regex(/^[0-9-]{9,13}$/, "올바른 전화번호 형식이 아닙니다."),
  customerEmail: z.string().email("올바른 이메일 형식이 아닙니다.").optional().or(z.literal("")),
  quantity: z.coerce.number().int().min(1, "수량은 1개 이상이어야 합니다."),
  message: z.string().max(1000).optional().or(z.literal("")),
});

export const orderLookupSchema = z.object({
  customerName: z.string().min(1, "이름을 입력해주세요."),
  customerPhone: z.string().min(1, "연락처를 입력해주세요."),
});

export const farmSchema = z.object({
  name: z.string().min(1, "농가 이름을 입력해주세요."),
  region: z.string().min(1, "지역(시/도)을 입력해주세요."),
  regionDetail: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  contactName: z.string().min(1, "담당자 이름을 입력해주세요."),
  contactPhone: z.string().min(1, "연락처를 입력해주세요."),
  contactEmail: z.string().email("올바른 이메일 형식이 아닙니다.").optional().or(z.literal("")),
  imageUrl: z.string().url("올바른 URL 형식이 아닙니다.").optional().or(z.literal("")),
});

export const productSchema = z.object({
  farmId: z.string().min(1, "농가를 선택해주세요."),
  name: z.string().min(1, "상품 이름을 입력해주세요."),
  category: z.string().min(1, "카테고리를 입력해주세요."),
  price: z.coerce.number().int().min(0, "가격은 0 이상이어야 합니다."),
  unit: z.string().min(1, "단위를 입력해주세요."),
  description: z.string().optional().or(z.literal("")),
  imageUrl: z.string().url("올바른 URL 형식이 아닙니다.").optional().or(z.literal("")),
  stockStatus: z.enum(["AVAILABLE", "SOLD_OUT"]),
});

export const orderStatusUpdateSchema = z.object({
  requestId: z.string().min(1),
  status: z.enum([
    "REQUESTED",
    "CONFIRMED",
    "PAYMENT_PENDING",
    "PAID",
    "SHIPPED",
    "COMPLETED",
    "CANCELLED",
  ]),
  adminNote: z.string().max(2000).optional().or(z.literal("")),
});
