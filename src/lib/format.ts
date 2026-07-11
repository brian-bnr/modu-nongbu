import type {
  InquiryStatus,
  PostStatus,
  PostType,
  DroneReservationStatus,
  DroneOperatorStatus,
  PaymentStatus,
  SettlementStatus,
  DisputeStatus,
} from "@prisma/client";

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

export const DRONE_RESERVATION_STATUS_LABEL: Record<DroneReservationStatus, string> = {
  REQUESTED: "신청됨",
  PAID: "결제완료",
  ASSIGNED: "배정됨",
  IN_PROGRESS: "작업중",
  COMPLETION_REQUESTED: "완료대기",
  COMPLETED: "완료",
  CANCELLED: "취소",
  DISPUTED: "분쟁중",
};

export const DRONE_RESERVATION_STATUS_VARIANT: Record<
  DroneReservationStatus,
  "neutral" | "green" | "amber" | "red" | "blue"
> = {
  REQUESTED: "neutral",
  PAID: "blue",
  ASSIGNED: "blue",
  IN_PROGRESS: "amber",
  COMPLETION_REQUESTED: "amber",
  COMPLETED: "green",
  CANCELLED: "red",
  DISPUTED: "red",
};

export const DRONE_OPERATOR_STATUS_LABEL: Record<DroneOperatorStatus, string> = {
  PENDING: "승인대기",
  APPROVED: "활동중",
  REJECTED: "거절됨",
  SUSPENDED: "정지됨",
};

export const DRONE_OPERATOR_STATUS_VARIANT: Record<
  DroneOperatorStatus,
  "neutral" | "green" | "amber" | "red" | "blue"
> = {
  PENDING: "neutral",
  APPROVED: "green",
  REJECTED: "red",
  SUSPENDED: "red",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  HELD: "에스크로 보관중",
  RELEASED: "정산완료",
  REFUNDED: "환불완료",
  PARTIALLY_REFUNDED: "부분환불",
};

export const PAYMENT_STATUS_VARIANT: Record<
  PaymentStatus,
  "neutral" | "green" | "amber" | "red" | "blue"
> = {
  HELD: "blue",
  RELEASED: "green",
  REFUNDED: "red",
  PARTIALLY_REFUNDED: "amber",
};

export const SETTLEMENT_STATUS_LABEL: Record<SettlementStatus, string> = {
  PENDING: "정산대기",
  PAID: "정산완료",
};

export const SETTLEMENT_STATUS_VARIANT: Record<SettlementStatus, "neutral" | "green"> = {
  PENDING: "neutral",
  PAID: "green",
};

export const DISPUTE_STATUS_LABEL: Record<DisputeStatus, string> = {
  OPEN: "접수됨",
  IN_REVIEW: "확인중",
  RESOLVED: "해결됨",
};

export const DISPUTE_STATUS_VARIANT: Record<DisputeStatus, "neutral" | "amber" | "green"> = {
  OPEN: "amber",
  IN_REVIEW: "neutral",
  RESOLVED: "green",
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
