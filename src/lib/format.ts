import type { RequestStatus, StockStatus } from "@prisma/client";

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  REQUESTED: "요청 접수",
  CONFIRMED: "농가 확인중",
  PAYMENT_PENDING: "결제 대기",
  PAID: "결제 완료",
  SHIPPED: "배송중",
  COMPLETED: "완료",
  CANCELLED: "취소",
};

export const STOCK_STATUS_LABEL: Record<StockStatus, string> = {
  AVAILABLE: "판매중",
  SOLD_OUT: "품절",
};

export const REQUEST_STATUS_VARIANT: Record<
  RequestStatus,
  "neutral" | "green" | "amber" | "red" | "blue"
> = {
  REQUESTED: "neutral",
  CONFIRMED: "blue",
  PAYMENT_PENDING: "amber",
  PAID: "green",
  SHIPPED: "blue",
  COMPLETED: "green",
  CANCELLED: "red",
};

export const STOCK_STATUS_VARIANT: Record<StockStatus, "green" | "red"> = {
  AVAILABLE: "green",
  SOLD_OUT: "red",
};

export function formatPrice(price: number) {
  return `${price.toLocaleString("ko-KR")}원`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
