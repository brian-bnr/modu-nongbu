import type { InquiryStatus, PostStatus, PostType } from "@prisma/client";

export const POST_TYPE_LABEL: Record<PostType, string> = {
  SELL_PRODUCT: "농산물 판매",
  BUY_PRODUCT: "농산물 구매",
  FIND_WORKER: "일손 모집",
  LOOKING_FOR_WORK: "일자리 찾기",
  RENT_MACHINE: "농기계 임대",
  NEED_MACHINE: "농기계 필요",
  DRONE_REQUEST: "드론 작업 모집",
  DRONE_SERVICE: "드론 작업 가능",
};

export const POST_TYPE_VARIANT: Record<
  PostType,
  "neutral" | "green" | "amber" | "red" | "blue"
> = {
  SELL_PRODUCT: "green",
  BUY_PRODUCT: "amber",
  FIND_WORKER: "blue",
  LOOKING_FOR_WORK: "neutral",
  RENT_MACHINE: "blue",
  NEED_MACHINE: "amber",
  DRONE_REQUEST: "blue",
  DRONE_SERVICE: "green",
};

export const POST_TYPE_ICON: Record<PostType, string> = {
  SELL_PRODUCT: "🥬",
  BUY_PRODUCT: "🛒",
  FIND_WORKER: "🧑‍🌾",
  LOOKING_FOR_WORK: "🙋",
  RENT_MACHINE: "🚜",
  NEED_MACHINE: "🚜",
  DRONE_REQUEST: "🚁",
  DRONE_SERVICE: "🚁",
};

export const POST_STATUS_LABEL: Record<PostStatus, string> = {
  OPEN: "진행중",
  CLOSED: "마감",
};

export const POST_STATUS_VARIANT: Record<PostStatus, "green" | "red"> = {
  OPEN: "green",
  CLOSED: "red",
};

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  REQUESTED: "요청 접수",
  ACCEPTED: "수락됨",
  COMPLETED: "완료",
  CANCELLED: "취소",
};

export const INQUIRY_STATUS_VARIANT: Record<
  InquiryStatus,
  "neutral" | "green" | "amber" | "red" | "blue"
> = {
  REQUESTED: "neutral",
  ACCEPTED: "blue",
  COMPLETED: "green",
  CANCELLED: "red",
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
